import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlaceDto } from 'src/places/dtos/place.dto';
import { Place, PlaceDocument } from 'src/schemas/place.schema';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private placeModel: Model<PlaceDocument>) {}

  async create(data: any, type: string): Promise<Place> {
    const currentUserId = "001";
    const place = new this.placeModel({ ...data, providerId: currentUserId, type: type});
    return place.save();
  }

  async findAll(type?: string): Promise<Place[]> {
    let places: Place[];
    if (type) {
      places = await this.placeModel.find({ type: type}).exec();
    } else{
      places = await this.placeModel.find().exec();
    }
    if (places.length === 0) {
      throw new NotFoundException('No places found');
    }

    return places;
  }

  findOne(id: string) {
    return this.placeModel.findById(id).exec();
  }

  async update(id: string, data: any, type: string) {
    const currentUserId = "001";
    const place = await this.placeModel.findById(id).exec();
    if (!place) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }
    if (place.providerId !== currentUserId) {
      throw new UnauthorizedException('You are not authorized to update this place');
    }
    if (place["type"] !== type) {
      throw new BadRequestException(`This endpoint does not support updating place of type ${place["type"]}`);
    }

    place.set({ ...data});
    return place.save();
  }

  async remove(id: string) {
    const currentUserId = "001";
    const deleted = await this.placeModel.findOneAndDelete({ _id: id, providerId: currentUserId}).exec();
    if (!deleted) {
      throw new NotFoundException(`Place with ID ${id} not found or not owned by user`);
    }
  }

  
}
