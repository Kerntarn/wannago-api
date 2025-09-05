import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlaceDto } from '../dtos/place.dto';
import { UpdatePlaceDto } from '../dtos/place.dto';
import { Place, PlaceDocument } from '../schemas/place.schema';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private placeModel: Model<PlaceDocument>) {}

  create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const createdPlace = new this.placeModel({ ...createPlaceDto, providerId: "001" });
    return createdPlace.save();
  }

  findAll(): Promise<Place[]> {
    return this.placeModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} place`;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
