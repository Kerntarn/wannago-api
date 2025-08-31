import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlaceDto } from 'src/dtos/place.dto';
import { UpdatePlaceDto } from 'src/dtos/place.dto';
import { Accommodation, accommodationDocument } from 'src/schemas/accommodation.schema';
import { Attraction, attractionDocument } from 'src/schemas/attraction.schema';
import { Place, PlaceDocument } from 'src/schemas/place.schema';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
              @InjectModel(Accommodation.name) private accomModel: Model<accommodationDocument>,
              @InjectModel(Attraction.name) private attraModel: Model<attractionDocument>,
              @InjectModel(Restaurant.name) private restauModel: Model<RestaurantDocument>,) {}

  create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const currentUserId = "001";
    const createdPlace = new this.placeModel({ ...createPlaceDto, providerId: currentUserId });
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
