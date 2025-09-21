# การจัดการสิทธิ์การเข้าถึงด้วย Role-Based Access Control (RBAC) ใน NestJS

เอกสารนี้อธิบายวิธีการใช้งาน `@CurrentUser()` decorator, `@Roles()` decorator และ `RolesGuard` เพื่อจัดการสิทธิ์การเข้าถึง (Authorization) ในแอปพลิเคชัน NestJS ของคุณ

## 1. `@CurrentUser()` Decorator

`@CurrentUser()` decorator ใช้สำหรับดึงข้อมูลผู้ใช้ที่ถูกรับรองความถูกต้อง (authenticated user) จากอ็อบเจกต์ `request` และส่งผ่านไปยังพารามิเตอร์ของเมธอดใน Controller โดยอัตโนมัติ ข้อมูลผู้ใช้นี้มักจะถูกเพิ่มเข้าไปใน `request` โดย `JwtStrategy` หลังจากที่ JWT ถูกตรวจสอบความถูกต้องแล้ว

**วิธีการใช้งาน:**

1.  **นำเข้า (`import`)**:
    ```typescript
    import { CurrentUser } from '../auth/decorators/current-user.decorator';
    ```

2.  **ใช้ในเมธอดของ Controller**:
    คุณสามารถใช้ `@CurrentUser()` เป็นพารามิเตอร์ของเมธอดใน Controller เพื่อเข้าถึงข้อมูลผู้ใช้ที่ล็อกอินอยู่ได้ทันที:

    ```typescript
    import { Controller, Get } from '@nestjs/common';
    import { CurrentUser } from '../auth/decorators/current-user.decorator';
    import { User } from '../schemas/user.schema'; // สมมติว่ามี User schema

    @Controller('profile')
    export class ProfileController {
      @Get()
      getProfile(@CurrentUser() user: User) {
        // ตอนนี้คุณสามารถเข้าถึงข้อมูล user ได้ เช่น user.email, user.role, user.firstName
        return `สวัสดี, ${user.firstName}! คุณมีสิทธิ์เป็น: ${user.role}`;
      }
    }
    ```
    **หมายเหตุ:** `CurrentUser` decorator จะทำงานได้ก็ต่อเมื่อมี Guard ที่ทำการรับรองความถูกต้อง (เช่น `JwtAuthGuard`) รันก่อนและใส่ข้อมูลผู้ใช้ลงใน `req.user` แล้วเท่านั้น

## 2. `@Roles()` Decorator

`@Roles()` decorator ใช้สำหรับกำหนดบทบาท (roles) ที่จำเป็นในการเข้าถึง route หรือ Controller นั้นๆ เป็นการติด Metadata ให้กับ route/Controller ซึ่ง `RolesGuard` จะนำไปใช้ในการตรวจสอบสิทธิ์

**วิธีการใช้งาน:**

1.  **นำเข้า (`import`)**:
    ```typescript
    import { Roles } from '../auth/decorators/roles.decorator';
    import { UserRole } from '../schemas/user.schema'; // เพื่อเข้าถึง enum ของบทบาท
    ```

2.  **กำหนดบทบาทที่เมธอดของ Controller**:
    คุณสามารถกำหนดบทบาทที่จำเป็นสำหรับเมธอดใดเมธอดหนึ่ง:

    ```typescript
    import { Controller, Get, UseGuards } from '@nestjs/common';
    import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
    import { RolesGuard } from '../auth/guards/role.guard';
    import { Roles } from '../auth/decorators/roles.decorator';
    import { UserRole } from '../schemas/user.schema';

    @Controller('admin')
    export class AdminController {
      @UseGuards(JwtAuthGuard, RolesGuard) // ต้องใช้ทั้ง JwtAuthGuard และ RolesGuard
      @Roles(UserRole.ADMIN) // กำหนดว่าต้องมีบทบาท 'admin' เท่านั้น
      @Get('dashboard')
      getAdminDashboard() {
        return 'นี่คือหน้าแดชบอร์ดสำหรับผู้ดูแลระบบเท่านั้น';
      }
    }
    ```

3.  **กำหนดบทบาทที่ระดับ Controller (สำหรับทุกเมธอดใน Controller นั้น)**:
    หากคุณต้องการให้ทุกเมธอดใน Controller ต้องมีบทบาทเดียวกัน คุณสามารถกำหนด `@Roles()` ที่ระดับ Controller:

    ```typescript
    import { Controller, Get, UseGuards } from '@nestjs/common';
    import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
    import { RolesGuard } from '../auth/guards/role.guard';
    import { Roles } from '../auth/decorators/roles.decorator';
    import { UserRole } from '../schemas/user.schema';

    @Controller('super-admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN) // ทุกเมธอดใน SuperAdminController ต้องมีบทบาท 'admin'
    export class SuperAdminController {
      @Get('settings')
      getSettings() {
        return 'การตั้งค่าสำหรับผู้ดูแลระบบ';
      }

      @Get('users')
      getAllUsers() {
        return 'รายการผู้ใช้ทั้งหมด';
      }
    }
    ```
    **หมายเหตุ:** หากคุณกำหนด `@Roles()` ทั้งที่ระดับ Controller และเมธอด NestJS จะใช้บทบาทที่กำหนดในเมธอดเป็นหลัก (มีความเฉพาะเจาะจงมากกว่า)

## 3. `RolesGuard`

`RolesGuard` คือ Guard ที่ใช้ตรวจสอบว่าผู้ใช้ที่เข้าถึง route มีบทบาทตรงกับที่ `@Roles()` decorator กำหนดไว้หรือไม่ หากไม่ตรงก็จะปฏิเสธการเข้าถึง

**วิธีการทำงาน:**

1.  `RolesGuard` จะอ่านบทบาทที่จำเป็นจาก Metadata ที่ถูกติดไว้ด้วย `@Roles()` decorator
2.  ดึงข้อมูลผู้ใช้ (รวมถึงบทบาท) จากอ็อบเจกต์ `request` (ซึ่งถูกใส่โดย `JwtAuthGuard`)
3.  ตรวจสอบว่าบทบาทของผู้ใช้ตรงกับบทบาทที่จำเป็นหรือไม่
4.  ถ้าตรงกันจะอนุญาตให้เข้าถึง (คืนค่า `true`) ถ้าไม่ตรงจะปฏิเสธการเข้าถึง (คืนค่า `false` และ NestJS จะส่งคืน `403 Forbidden`)

**วิธีการใช้งาน:**

`RolesGuard` จะต้องถูกใช้ร่วมกับ Guard สำหรับการรับรองความถูกต้อง (เช่น `JwtAuthGuard`) เสมอ คุณสามารถใช้ `RolesGuard` ได้ใน 3 ระดับ:

1.  **ระดับเมธอด (Method-level)**:
    ใช้ `@UseGuards(JwtAuthGuard, RolesGuard)` เหนือเมธอดที่คุณต้องการป้องกัน

    ```typescript
    import { Controller, Get, UseGuards } from '@nestjs/common';
    import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
    import { RolesGuard } from '../auth/guards/role.guard';
    import { Roles } from '../auth/decorators/roles.decorator';
    import { UserRole } from '../schemas/user.schema';

    @Controller('data')
    export class DataController {
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(UserRole.USER) // อนุญาตเฉพาะผู้ใช้ทั่วไป
      @Get('my-data')
      getMyData() {
        return 'ข้อมูลส่วนตัวของคุณ';
      }
    }
    ```

2.  **ระดับ Controller (Controller-level)**:
    ใช้ `@UseGuards(JwtAuthGuard, RolesGuard)` เหนือ class ของ Controller เพื่อป้องกันทุกเมธอดใน Controller นั้น

    ```typescript
    import { Controller, Get, UseGuards } from '@nestjs/common';
    import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
    import { RolesGuard } from '../auth/guards/role.guard';
    import { Roles } from '../auth/decorators/roles.decorator';
    import { UserRole } from '../schemas/user.schema';

    @Controller('user-settings')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER) // ทุกเมธอดใน Controller นี้อนุญาตเฉพาะผู้ใช้ทั่วไป
    export class UserSettingsController {
      @Get('change-password')
      changePassword() {
        return 'หน้าเปลี่ยนรหัสผ่าน';
      }
    }
    ```

3.  **ระดับ Global (Global-level)**:
    คุณสามารถลงทะเบียน `RolesGuard` เป็น Global Guard ใน `AppModule` เพื่อให้มันทำงานกับทุก route ในแอปพลิเคชันของคุณ นี่เป็นวิธีที่สะดวกหากส่วนใหญ่ของ route ต้องการการป้องกันบทบาท

    ```typescript
    // ใน src/app.module.ts
    import { Module } from '@nestjs/common';
    import { APP_GUARD } from '@nestjs/core';
    import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
    import { RolesGuard } from './auth/guards/role.guard';

    @Module({
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard, // รัน JwtAuthGuard ก่อน
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,   // รัน RolesGuard หลังจาก JwtAuthGuard
        },
      ],
      // ... imports, controllers อื่นๆ
    })
    export class AppModule {}
    ```
    เมื่อใช้ Global Guard, คุณอาจต้องสร้าง `@Public()` หรือ `@SkipRoles()` decorator เพื่อข้ามการตรวจสอบ Guard สำหรับบาง route ที่ไม่ต้องการการป้องกันบทบาท

## สรุป: ลำดับการทำงาน

เมื่อมีการร้องขอเข้ามายัง route ที่มีการป้องกันบทบาท:

1.  **`JwtAuthGuard` ทำงาน**: ตรวจสอบ JWT token, ถอดรหัส, และดึงข้อมูลผู้ใช้ (รวมถึง `role`) ไปใส่ใน `req.user`
2.  **`RolesGuard` ทำงาน**:
    *   อ่านบทบาทที่จำเป็นจาก `@Roles()` decorator
    *   ดึงบทบาทของผู้ใช้จาก `req.user.role`
    *   เปรียบเทียบบทบาท หากตรงกันจะอนุญาต หากไม่ตรงจะปฏิเสธ

การใช้ `@CurrentUser()` decorator, `@Roles()` decorator และ `RolesGuard` ร่วมกันช่วยให้คุณสามารถสร้างระบบ RBAC ที่แข็งแกร่งและบำรุงรักษาง่ายใน NestJS.