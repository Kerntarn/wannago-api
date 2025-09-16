import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly userservice: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  getProfile(@CurrentUser() user) {
    console.log(user);
    return user;
  }

}