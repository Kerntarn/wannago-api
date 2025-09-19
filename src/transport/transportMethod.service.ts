import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTransportMethodDto } from './dtos/create-transportMethod.dto';
import { UpdateTransportMethodDto } from './dtos/update-transportMethod.dto';
import { TransportMethod, TransportMethodDocument } from '../schemas/transportMethod.schema';
import { TransportType, defaultTransportPrices } from './transportMethod.asset';

@Injectable()
export class TransportMethodService {
  private defaultPrices = defaultTransportPrices; 
  constructor(
    @InjectModel(TransportMethod.name)
    private readonly transportMethodModel: Model<TransportMethodDocument>,
  ) {}

  async create(dto: CreateTransportMethodDto) {

    const speed = await this.calculateSpeed(dto.distance, dto.duration);

    if (!Object.values(TransportType).includes(dto.name as TransportType)) {
      throw new Error(`Transport type "${dto.name}" invalid`);
    }
    const transportName = dto.name as TransportType;

    const caledPrice = await this.calculatePrice(transportName, dto.distance);

    const data: any = { ...dto, speed: speed, price:caledPrice };
    if (dto.providerId) {
      data.providerId = new Types.ObjectId(dto.providerId);
    }
  
    const transport = await this.transportMethodModel.create(data);
    return transport
  }

  async calculatePrice(name: TransportType, distance: number): Promise<number> {
    const pricePerKm = this.defaultPrices[name];
    if (!pricePerKm) {
      throw new Error(`Transport type "${name}" invalid`);
    }
    return pricePerKm * distance;
  }

  async calculateSpeed(distance: number, duration: number): Promise<number> {
    const distanceKm = distance / 1000;
    const durationH = duration / 3600;
    return distanceKm / durationH ;
  }

  async findByRouteId(routeId: string) {
    const transports = await this.transportMethodModel.find({ routeId }).exec();
    if (!transports || transports.length === 0) {
      throw new NotFoundException(`No transport found for routeId: ${routeId}`);
    }
    return transports;
  }

  async deleteByRouteId(routeId: string) {
    const result = await this.transportMethodModel.deleteMany({ routeId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`No transport found to delete for routeId: ${routeId}`);
    }
    return { message: `Deleted ${result.deletedCount} transport(s)` };
  }

  async findAll(): Promise<TransportMethod[]> {
    return this.transportMethodModel.find().exec();
  }

  async findOne(id: string): Promise<TransportMethod> {
    const transport = await this.transportMethodModel.findById(id).exec();
    if (!transport) throw new NotFoundException(`TransportMethod #${id} not found`);
    return transport;
  }

  async update(id: string, dto: UpdateTransportMethodDto): Promise<TransportMethod> {
    const updated = await this.transportMethodModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`TransportMethod #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<TransportMethod> {
    const deleted = await this.transportMethodModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`TransportMethod #${id} not found`);
    return deleted;
  }
}