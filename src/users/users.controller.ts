import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
@Controller('users')
export class UsersController {
    constructor(private readonly userservice: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user) {
    return {
      id: user.userId,
      email: user.email,
      userName: user.username,
      role: user.role, // เพิ่ม role ได้ด้วย
    };
  }

}