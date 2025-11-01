import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { TransportMethodService } from './transportMethod.service';
import { CreateTransportMethodDto } from './dtos/create-transportMethod.dto';
import { UpdateTransportMethodDto } from './dtos/update-transportMethod.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/schemas/user.schema';

@Controller('transport-method')
export class TransportMethodController {
  constructor(private readonly transportService: TransportMethodService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.PROVIDER)
  @Post()
  async create(@Body() dto: CreateTransportMethodDto, @CurrentUser() user) {
    const created = await this.transportService.create(dto, user);
    return {
      message: 'TransportMethod created successfully',
      status: HttpStatus.CREATED,
      data: created,
    };
  }

  @Get()
  async findAll() {
    const transports = await this.transportService.findAll();
    return {
      message: 'All TransportMethods fetched',
      status: HttpStatus.OK,
      data: transports,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const transport = await this.transportService.findOne(id);
    return {
      message: 'TransportMethod fetched',
      status: HttpStatus.OK,
      data: transport,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.PROVIDER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTransportMethodDto, @CurrentUser() user) {
    const updated = await this.transportService.update(id, dto);
    return {
      message: 'TransportMethod updated',
      status: HttpStatus.OK,
      data: updated,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.PROVIDER)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user) {
    const deleted = await this.transportService.remove(id);
    return {
      message: 'TransportMethod deleted',
      status: HttpStatus.OK,
      data: deleted,
    };
  }
}