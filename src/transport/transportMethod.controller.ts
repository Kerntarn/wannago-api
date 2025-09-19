import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { TransportMethodService } from './transportMethod.service';
import { CreateTransportMethodDto } from './dtos/create-transportMethod.dto';
import { UpdateTransportMethodDto } from './dtos/update-transportMethod.dto';

@Controller('transport-method')
export class TransportMethodController {
  constructor(private readonly transportService: TransportMethodService) {}

  @Post()
  async create(@Body() dto: CreateTransportMethodDto) {
    const created = await this.transportService.create(dto);
    return { data: created };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const transport = await this.transportService.findOne(id);
    return { data: transport };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.transportService.remove(id);
    return {
      message: 'TransportMethod deleted',
      data: deleted,
    };
  }

  @Get('route/:routeId')
  async findByRouteId(@Param('routeId') routeId: string) {
    return this.transportService.findByRouteId(routeId);
  }

  @Delete('route/:routeId')
  async deleteByRouteId(@Param('routeId') routeId: string) {
    return this.transportService.deleteByRouteId(routeId);
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
}