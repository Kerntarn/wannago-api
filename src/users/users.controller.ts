import { Controller, Get, UseGuards, Request, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from 'src/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth } from '@nestjs/swagger'

@Controller('users')
export class UsersController {
    constructor(private readonly userservice: UsersService) {}

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.USER)
  getProfile(@CurrentUser() user) {
    console.log(user);
    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.USER)
  editProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userservice.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.userservice.remove(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.USER)
  getUserById(@Param('id') id: string) {
    return this.userservice.findById(id);
  }
}