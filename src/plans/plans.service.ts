import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePlanDto, UpdatePlanDto } from 'src/plans/plan.dto';
import { Model, ObjectId } from 'mongoose';
import { Plan, planDocument } from 'src/schemas/plan.schema';
import { GuestService } from 'src/guest/guest.service';
import { PlacesService } from 'src/places/places.service';
import { TagsService } from 'src/tags/tags.service';
import { PlaceDocument } from 'src/schemas/place.schema';
import { TransportMethodService } from 'src/transport/transportMethod.service';
import {
  ItineraryDay,
  LocationInItinerary,
} from 'src/schemas/itinerary.schema';
import { Place } from 'src/schemas/place.schema';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<planDocument>,
    private readonly guestService: GuestService,
    private readonly placesService: PlacesService,
    private readonly tagsService: TagsService,
    private readonly transportMethodService: TransportMethodService, // Inject TransportMethodService
  ) {}

  async create(createPlanDto: CreatePlanDto, userId: string) {
    const newPlan = await this.generatePlan(createPlanDto);
    const createdPlan = new this.planModel({ ...newPlan, ownerId: userId });
    await createdPlan.save();
    return createdPlan;
  }

  async createTemporary(createPlanDto: CreatePlanDto, guestId: string) {
    const newPlan = await this.generatePlan(createPlanDto);
    const createdPlan = new this.planModel(newPlan);
    this.guestService.addPlanToGuest(guestId, createdPlan._id);
    await createdPlan.save();
    return createdPlan;
  }

  async assignPlanToUser(planId: string, userId: string): Promise<Plan> {
    return this.planModel.findByIdAndUpdate(planId, { ownerId: userId }).exec();
  }

  findAll(userId?: ObjectId) {
    if (userId) {
      return this.planModel.find({ ownerId: userId }).exec();
    }

    return this.planModel.find().exec();
  }

  async findOne(id: string, curUserId: ObjectId) {
    console.log(id);
    const plan = await this.planModel.findById(id).exec();
    let isOwner = true;
    if (plan.ownerId.toString() !== curUserId.toString()) {
        isOwner = false;
    }

    return { plan, isOwner };

  }

  update(id: string, updatePlanDto: UpdatePlanDto) {
    return this.planModel.findByIdAndUpdate(id, updatePlanDto).exec();
  }

  async remove(id: string, curUserId: ObjectId) {
    const plan = await this.planModel.findById(id).exec();
    if (plan.ownerId.toString() !== curUserId.toString()) {
        throw new BadRequestException('You are not authorized to delete this plan.');
    }
    

    return this.planModel.findByIdAndDelete(id).exec();
  }

  async generatePlan(dto: CreatePlanDto): Promise<Partial<Plan>> {
    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const endDate = dto.endDate
      ? new Date(dto.endDate)
      : new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000); // Default to 3 days trip

    const planEntity: Partial<Plan> = {
      title: `ทริป ${dto.where || 'ไร้ชื่อ'}`,
      where: dto.where,
      category: dto.category,
      budget: dto.budget,
      transportation: dto.transportation,
      people: dto.people,
      startDate: startDate,
      endDate: endDate,
      source: dto.source,
      itinerary: {},
    };

    const diffTime = Math.abs(
      planEntity.endDate.getTime() - planEntity.startDate.getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Create an empty itinerary for the duration
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(planEntity.startDate);
      currentDate.setDate(planEntity.startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      const dayName = currentDate.toLocaleString('th-TH', { weekday: 'long' });
      const date = currentDate.toLocaleString('th-TH', {
        day: 'numeric',
        month: 'long',
      });

      planEntity.itinerary[dateString] = {
        dayName: dayName,
        date: date,
        description: '',
        locations: [] as any,
        travelTimes: [],
      };
    }

    const addLocationsToItinerary = (places: PlaceDocument[]) => {
      const days = Object.keys(planEntity.itinerary);

      const attractions = places.filter(
        (p) => (p as any).type === 'attraction',
      );
      const restaurants = places.filter(
        (p) => (p as any).type === 'restaurant',
      );
      const accommodations = places.filter(
        (p) => (p as any).type === 'accommodation',
      );

      const availableRestaurants = [...restaurants];
      const availableAccommodations = [...accommodations];

      const attractionsPerDay = Math.ceil(attractions.length / days.length);

      days.forEach((day, dayIndex) => {
        const startIndex = dayIndex * attractionsPerDay;
        const endIndex = startIndex + attractionsPerDay;
        const dayAttractions = attractions.slice(startIndex, endIndex);

        const dayPlaces = [...dayAttractions];

        if (availableRestaurants.length > 0) {
          dayPlaces.push(availableRestaurants.shift());
        }

        if (availableAccommodations.length > 0) {
          dayPlaces.push(availableAccommodations.shift());
        }

        // Clear existing locations
        planEntity.itinerary[day].locations.splice(0, planEntity.itinerary[day].locations.length);

        dayPlaces.forEach((place, index) => {
          const locationInItinerary: LocationInItinerary = {
            id: place._id.toString(),
            name: place.name,
            source: place.location as [number, number],
            order: index + 1,
            image: place.imageUrl,
            description: place.description,
            startTime: undefined,
            endTime: undefined,
            stayMinutes: undefined,
            openHours: undefined,
          };

          if ((place as any).type === 'attraction') {
            locationInItinerary.description = `Entry Fee: ${(place as any).entryFee}฿. ${place.description}`;
          } else if ((place as any).type === 'restaurant') {
            locationInItinerary.startTime = (place as any).openingHours;
            locationInItinerary.endTime = (place as any).closingHours;

            const parseTimeToMinutes = (timeString: string) => {
              if (!timeString) return null;
              const [hours, minutes] = timeString.split(':').map(Number);
              return hours * 60 + minutes;
            };

            const startMinutes = parseTimeToMinutes(locationInItinerary.startTime);
            const endMinutes = parseTimeToMinutes(locationInItinerary.endTime);

            if (startMinutes !== null && endMinutes !== null) {
              const totalMinutes = endMinutes - startMinutes;
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
              if (hours > 0 && minutes > 0) {
                locationInItinerary.openHours = `${hours}h ${minutes}m`;
              } else if (hours > 0) {
                locationInItinerary.openHours = `${hours}h`;
              } else if (minutes > 0) {
                locationInItinerary.openHours = `${minutes}m`;
              } else {
                locationInItinerary.openHours = undefined;
              }
            } else {
              locationInItinerary.openHours = undefined; // Ensure openHours is set to undefined if calculation fails
            }

            locationInItinerary.description = `Cuisine: ${(place as any).cuisineType}. Contact: ${(place as any).contactInfo}. ${place.description}`;
          } else if ((place as any).type === 'accommodation') {
            locationInItinerary.description = `Facilities: ${(place as any).facilities.join(', ')}. Star Rating: ${(place as any).starRating}. Redirect: ${(place as any).redirectUrl || 'N/A'}. ${place.description}`;
          }
          planEntity.itinerary[day].locations.push(locationInItinerary);
        });

        // Mock travel times between locations for the current day
        planEntity.itinerary[day].travelTimes = [];
        for (let i = 0; i < dayPlaces.length - 1; i++) {
          const travelTimeMinutes = Math.floor(Math.random() * 30) + 5; // Random time between 5 and 35 minutes
          planEntity.itinerary[day].travelTimes.push(travelTimeMinutes);
        }
      });
    };

    if (dto.where || dto.where === '') {
      const places = await this.placesService.findByName(dto.where);
      addLocationsToItinerary(places);
    } else if (dto.source) {
      const defaultPlaces = await this.placesService.findDefaultPlaces(
        dto.category,
      );
      addLocationsToItinerary(defaultPlaces);
    }

    return planEntity;
  }
}
