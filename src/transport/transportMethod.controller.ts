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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTransportMethodDto) {
    const updated = await this.transportService.update(id, dto);
    return {
      message: 'TransportMethod updated',
      status: HttpStatus.OK,
      data: updated,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.transportService.remove(id);
    return {
      message: 'TransportMethod deleted',
      status: HttpStatus.OK,
      data: deleted,
    };
  }
}