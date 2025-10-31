import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { asyncWrapProviders } from 'async_hooks';
import { Model, ObjectId } from 'mongoose';
import { UpdatePlaceDto } from 'src/places/dtos/place.dto';
import { Place, PlaceDocument } from 'src/schemas/place.schema';
import { User } from 'src/schemas/user.schema';
import { TagsService } from 'src/tags/tags.service';
import axios from 'axios';
import { AdService } from 'src/ad/ad.service';
import { mockPlaces } from './mock-places'; // Import mock data
import { mockIsanPlaces } from './mock-isan-places';
import { mockChiangmaiPlaces } from './mock-chiangmai-places';
import { mockBangkokAdventurePlaces } from './mock-bangkok-adventure-places';

@Injectable()
export class PlacesService {
  private useMockData: boolean;

  constructor(
    @InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
    private readonly tagsService: TagsService,
    private readonly adService: AdService,
  ) {
    this.useMockData = process.env.NODE_ENV === 'test' || process.env.USE_MOCK_DATA === 'true';
  }

  async create(data: any, type: string, user: User): Promise<PlaceDocument> {
    if (this.useMockData) {
      throw new Error('Create operation not supported with mock data');
    }
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

  async findAll(type?: string, userId?: ObjectId): Promise<PlaceDocument[]> {
    if (this.useMockData) {
      return mockPlaces.filter(place => {
        const typeMatch = type ? (place as any).__t === type : true;
        const userIdMatch = userId ? place.providerId.toString() === userId.toString() : true;
        return typeMatch && userIdMatch;
      });
    }

    let places: PlaceDocument[];
    
    if (type && userId) {
      places = await this.placeModel.find({ type: type, providerId: userId }).exec();
    } else if (type && !userId) {
      places = await this.placeModel.find({ type: type }).exec();
    } else if (!type && userId) {
      places = await this.placeModel.find({ providerId: userId }).exec();
    } else {
      places = await this.placeModel.find().exec();
    }
    if (places.length === 0) {
      throw new NotFoundException('No places found');
    }

    return places;
  }

  findOne(id: string): Promise<PlaceDocument> {
    if (this.useMockData) {
      return Promise.resolve(mockPlaces.find(place => place._id.toString() === id));
    }
    return this.placeModel.findById(id).exec();
  }

  async findByName(name: string): Promise<PlaceDocument[]> {
    if (this.useMockData) {
      if (name === 'อีสานใต้') {
        return Promise.resolve(mockIsanPlaces);
      }
      if (name === 'เชียงใหม่') {
        return Promise.resolve(mockChiangmaiPlaces);
      }
      return Promise.resolve(mockPlaces.filter(place => new RegExp(name, 'i').test(place.name)));
    }
    const places = await this.placeModel.find({ name: new RegExp(name, 'i') }).exec();
    console.log(places);
    return places;
  }

  async update(id: string, data: any, type: string, userId: ObjectId) {
    if (this.useMockData) {
      throw new Error('Update operation not supported with mock data');
    }
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

  async remove(id: string, curUserId: ObjectId) {
    if (this.useMockData) {
      throw new Error('Remove operation not supported with mock data');
    }
    const deleted = await this.placeModel.findOneAndDelete({ _id: id, providerId: curUserId }).exec();
    if (!deleted) {
      throw new NotFoundException(`Place with ID ${id} not found or not owned by user`);
    }
  }
  
  async getMostRelatedPlace(places: PlaceDocument[], preferredTags: string[]): Promise<PlaceDocument[]> {
    if (this.useMockData) {
      // Simple mock for related places based on tags
      return Promise.resolve(places.filter(place =>
        place.tags.some(tag => preferredTags.includes(tag))
      ).slice(0, 3)); // Return top 3 for mock
    }
    console.log(`This is${places}`)
    const tags = this.tagsService.getWeight();
    
   const result = places.map(place => {
      const score = place.tags.map(tag => (preferredTags.includes(tag) ? tags[tag] : 0));
      return { place, score }; // Return place object directly
    });
    result.sort((a, b) => {
      const sumA = a.score.reduce((acc, curr) => acc + curr, 0);
      const sumB = b.score.reduce((acc, curr) => acc + curr, 0);
      return sumB - sumA;
    });
    return result.map(item => item.place); // Return only the PlaceDocument
  }
  
  async getCoordinates(url: string): Promise<[ number, number ]> {
    if (this.useMockData) {
      // Return a fixed coordinate for mock data testing
      return Promise.resolve([100.5018, 13.7563]);
    }
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

  private getDistanceBetweenCoordinates(coord1: [number, number], coord2: [number, number]): number {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(coord2[1] - coord1[1]);
    const dLon = toRad(coord2[0] - coord1[0]);

    const lat1 = toRad(coord1[1]);
    const lat2 = toRad(coord2[1]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  async findNearbyPlaces(
    coordinate: [number, number],
    limit: number,
    excludedPlaceId?: string,
  ): Promise<PlaceDocument[]> {
    if (this.useMockData) {
      return Promise.resolve(
        mockPlaces
          .filter(place => place._id.toString() !== excludedPlaceId)
          .sort((a, b) => this.getDistanceBetweenCoordinates(coordinate, a.location as [number, number]) -
                           this.getDistanceBetweenCoordinates(coordinate, b.location as [number, number]))
          .slice(0, limit)
      );
    }
    const allPlaces = await this.placeModel.find().exec();

    const placesWithDistance = allPlaces
      .map((place) => {
        const distance = this.getDistanceBetweenCoordinates(
          coordinate,
          place.location as [number, number],
        );
        return { place, distance };
      })
      .filter(({ place }) => place._id.toString() !== excludedPlaceId) // Exclude the place itself
      .sort((a, b) => a.distance - b.distance);

    return placesWithDistance.slice(0, limit).map((item) => item.place);
  }

    async findDefaultPlaces(categories: string[]): Promise<PlaceDocument[]> {
    if (this.useMockData) {
      const adventureCategories = ["ธรรมชาติ", "ผจญภัย"];
      if (categories.some(cat => adventureCategories.includes(cat))) {
        return Promise.resolve(mockBangkokAdventurePlaces);
      }
    }
    // Fallback to a default list if no matching categories
    return Promise.resolve(mockPlaces.slice(0, 3));
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
