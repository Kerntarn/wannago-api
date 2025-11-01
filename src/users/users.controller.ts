import { Controller, Get, UseGuards, Request, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GuestAuthGuard } from 'src/auth/guards/guest-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/schemas/user.schema';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, GuestAuthGuard)
@ApiBearerAuth('jwt')
export class UsersController {
    constructor(private readonly userservice: UsersService) {}

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.userservice.findAll();
  }

  @Get('')
  getProfile(@CurrentUser() user: User) {
    console.log(user);
    return user;
  }

  @Patch('me')
  updateCurrentUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userservice.update(user._id.toString(), updateUserDto);
  }

  @Patch(':id')
  editProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userservice.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.userservice.remove(id);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userservice.findById(id);
  }
}