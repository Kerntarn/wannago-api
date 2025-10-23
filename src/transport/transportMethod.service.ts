import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransportMethodDto } from './dtos/create-transportMethod.dto';
import { UpdateTransportMethodDto } from './dtos/update-transportMethod.dto';
import { TransportMethod, TransportMethodDocument } from '../schemas/transportMethod.schema';

@Injectable()
export class TransportMethodService {
  constructor(
    @InjectModel(TransportMethod.name)
    private readonly transportMethodModel: Model<TransportMethodDocument>,
  ) {}

  async create(dto: CreateTransportMethodDto): Promise<TransportMethodDocument> {
    if (dto.providerId) {
      dto.hasBooking = true;
    }
    const created = new this.transportMethodModel(dto);
    return created.save();
  }

  async findAll(): Promise<TransportMethodDocument[]> {
    return this.transportMethodModel.find().exec();
  }

  async findOne(id: string): Promise<TransportMethodDocument> {
    const transport = await this.transportMethodModel.findById(id).exec();
    if (!transport) throw new NotFoundException(`TransportMethod #${id} not found`);
    return transport;
  }

  async findByName(name: string): Promise<TransportMethodDocument> {
    const transport = await this.transportMethodModel.findOne({ name }).exec();
    if (!transport) throw new NotFoundException(`TransportMethod with name ${name} not found`);
    return transport;
  }

  async update(id: string, dto: UpdateTransportMethodDto): Promise<TransportMethodDocument> {
    const updated = await this.transportMethodModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`TransportMethod #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<TransportMethodDocument> {
    const deleted = await this.transportMethodModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`TransportMethod #${id} not found`);
    return deleted;
  }
}