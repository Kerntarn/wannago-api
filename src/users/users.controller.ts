import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
    constructor(private readonly userservice: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userservice.findByEmail(req.user.email);
    return {
      id : user._id,
      email: user.email,
      userName: user.userName,
    };
}

}