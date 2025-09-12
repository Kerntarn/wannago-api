import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let user = request.user; // ใช้ let แทน const

    if (!user) {
      return null;
    }

    // แปลง Mongoose Document เป็น plain object
    if (typeof user.toObject === 'function') {
      user = user.toObject();
    }

    // คืน field เฉพาะถ้ามี data
    if (data) return user[data];

    // คืน object ทั้งหมด
    return user;
  },
);
