import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UpdatePlaceDto } from 'src/places/dtos/place.dto';
import { Place, PlaceDocument } from 'src/schemas/place.schema';
import { User } from 'src/schemas/user.schema';
import { TagsService } from 'src/tags/tags.service';
import axios from 'axios';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
    private readonly tagsService: TagsService
  ) {}

  async create(data: any, type: string, user: User): Promise<Place> {
    if (!user) throw new UnauthorizedException('User need token to create place');

    try {
        const coords = await this.getCoordinates(data.location);
        data.location = coords;
    } catch (err) {
        throw new BadRequestException('Cannot extract coordinates from URL');
    }

    const currentUserId = user._id;
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

  async findByName(name: string): Promise<Place[]> {
    const places = await this.placeModel.find({ name: new RegExp(name, 'i') }).exec();
    return places;
  }

  async update(id: string, data: any, type: string, userId: ObjectId) {
    const place = await this.placeModel.findById(id).exec();
    if (!place) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }
    if (place.providerId !== userId) {
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
  
  async getMostRelatedPlace(places: Place[], preferredTags: string[]): Promise<Place> {
    const tags = this.tagsService.getWeight();
    
    const result = places.map(place => {
      const score = place.tags.map(tag => {
        return (preferredTags.includes(tag) ? tags[tag] : 0);
      });
      return { ...place, score };
    });
    result.sort((a, b) => {
      const sumA = a.score.reduce((acc, curr) => acc + curr, 0);
      const sumB = b.score.reduce((acc, curr) => acc + curr, 0);
      return sumB - sumA;
    });
    return result[0];
  }
  
  async getCoordinates(url: string): Promise<[ number, number ]> {
    if (!url) throw new BadRequestException('URL is required');

    //short link
    if (url.includes('goo.gl') || url.includes('maps.app.goo.gl')) {
      try {
        const res = await axios.get(url, {
          maxRedirects: 0,
          validateStatus: status => status >= 200 && status < 400,
        } as any);

        // ดึง URL จาก header location
        const redirectUrl = res.headers['location'];
        if (!redirectUrl) throw new BadRequestException('Cannot extract coordinates from link');

        const coords = this.parseLatLng(redirectUrl);
        if (!coords) throw new BadRequestException('Cannot extract coordinates from link');
        return coords;
      } catch (err: any) {
        if (err.response?.status === 302) {
          const redirectUrl = err.response.headers.location;
          const coords = this.parseLatLng(redirectUrl);
          if (!coords) throw new BadRequestException('Cannot extract coordinates from link');
          return coords;
        }
        throw new BadRequestException('Invalid Google Maps URL');
      }
    } else {
      //full link
      const coords = this.parseLatLng(url);
      if (!coords) throw new BadRequestException('Cannot extract coordinates from link');
      return coords;
    }
  }

  private parseLatLng(url: string): [ number, number ] | null {

    let match = url.match(/@([-.\d]+),([-.\d]+)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }

    match = url.match(/\/place\/([-.\d]+),([-.\d]+)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    return null;
  }
}
