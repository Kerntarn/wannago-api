import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClonedPlanDto, CreatePlanDto, UpdatePlanDto } from 'src/plans/plan.dto';
import { Model, ObjectId } from 'mongoose';
import { Plan, planDocument } from 'src/schemas/plan.schema';
import { GuestService } from 'src/guest/guest.service';
import { PlacesService } from 'src/places/places.service';
import { TagsService } from 'src/tags/tags.service';
import { PlaceDocument } from 'src/schemas/place.schema';
import { TransportMethodService } from 'src/transport/transportMethod.service';
import { ItineraryDay, LocationInItinerary } from 'src/schemas/itinerary.schema';
import { TransportMethod } from 'src/schemas/transportMethod.schema';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<planDocument>,
    private readonly guestService: GuestService,
    private readonly placesService: PlacesService,
    private readonly tagsService: TagsService,
    private readonly transportMethodService: TransportMethodService,
  ) {}

  async create(createPlanDto: CreatePlanDto, userId: string) {
    const newPlan = await this.generatePlan(createPlanDto);
    const createdPlan = new this.planModel({ ...newPlan, ownerId: userId });
    // let transportMethods: TransportMethod[] = [];
    // if (createdPlan.transportation !== "รถยนต์ส่วนตัว"){
    //   transportMethods = await this.transportMethodService.getTransportMethodsForPlan();
    // }

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

  async clone(clonedPlanDto: ClonedPlanDto, userId: string) {
    const planToClone = await this.planModel.findById(clonedPlanDto.originalPlanId).select('-_id -createdAt -updatedAt -ownerId').exec();
    if (!planToClone) {
      throw new NotFoundException('Plan to clone not found');
    }

    console.log(planToClone.toObject())
    const clonedPlanData: planDocument = new this.planModel({ ...planToClone.toObject(), ownerId: userId, source: clonedPlanDto.source, title: planToClone.title + ' (copy)' });
    await clonedPlanData.save()
    return clonedPlanData;
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

  async findOne(id: string, curUserId?: ObjectId) {
    // console.log(id);
    const plan = await this.planModel.findById(id).populate('providedCar', '-updatedAt -createdAt -providerId').exec();
    let isOwner = false;
    if (curUserId && plan.ownerId.toString() === curUserId.toString()) {
        isOwner = true;
    }

    return { plan, isOwner };

  }

  async update(updatePlanDto: UpdatePlanDto, curUserId: ObjectId) {
    const plan = await this.planModel.findById(updatePlanDto._id).exec();
    if (plan.ownerId.toString() !== curUserId.toString()) {
        throw new ForbiddenException('You are not authorized to update this plan.');
    }
    const updatedPlan = await this.planModel.findByIdAndUpdate(updatePlanDto._id, updatePlanDto, { new: true }).populate('providedCar', '-updatedAt -createdAt -providerId').exec();
    return updatedPlan;
  }

  async remove(id: string, curUserId: ObjectId) {
    const plan = await this.planModel.findById(id).exec();
    if (plan.ownerId.toString() !== curUserId.toString()) {
        throw new ForbiddenException('You are not authorized to delete this plan.');
    }


    return this.planModel.findByIdAndDelete(id).exec();
  }

  async generatePlan(dto: CreatePlanDto): Promise<Partial<Plan>> {
    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const endDate = dto.endDate
      ? new Date(dto.endDate)
      : new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);

    let sourceCoordinates: [number, number] | undefined;
    if (dto.source) {
      if (typeof dto.source === 'string') {
        try {
          sourceCoordinates = await this.placesService.getCoordinates(dto.source);
        } catch (error) {
          throw new BadRequestException('Invalid source URL');
        }
      } else if (Array.isArray(dto.source) && dto.source.length === 2) {
        sourceCoordinates = dto.source as [number, number];
      } else {
        throw new BadRequestException(
          'Invalid source format. Must be a URL string or a [longitude, latitude] array.',
        );
      }
    }

    let planWhere = dto.where;
    if (dto.isCurrentLocationHotel && sourceCoordinates) {
      const nearbyPlaces = await this.placesService.findNearbyPlaces(sourceCoordinates, 1);
      const accommodation = nearbyPlaces.find(
        (place) => (place as any).type === 'accommodation',
      );
      if (accommodation) {
        planWhere = accommodation.name;
      }
    }
 
    const planEntity: Partial<Plan> = { 
      title: `ทริป ${planWhere || 'ไร้ชื่อ'}`,
      where: planWhere,
      category: dto.category,
      budget: dto.budget,
      transportation: dto.transportation,
      people: dto.people,
      startDate: startDate,
      endDate: endDate,
      source: sourceCoordinates,
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

        // Clear existing locations and travel times
        planEntity.itinerary[day].locations.splice(
          0,
          planEntity.itinerary[day].locations.length,
        );
        planEntity.itinerary[day].travelTimes = [];

        // Calculate travel times between places for the day
        for (let i = 0; i < dayPlaces.length - 1; i++) {
          const travelTimeMinutes = Math.floor(Math.random() * 30) + 5; // Random time between 5 and 35 minutes
          planEntity.itinerary[day].travelTimes.push(travelTimeMinutes);
        }

        // Set the start time for the day's activities
        const dayStartDate = new Date(day); // 'day' is the YYYY-MM-DD string key
        dayStartDate.setHours(9, 0, 0, 0); // Start day at 9 AM

        let currentTime = dayStartDate;

        dayPlaces.forEach((place, index) => {
          const startTime = new Date(currentTime);

          // Use stayMin from place or default to 2 hours
          const durationMinutes = (place as any).stayMin || 120;

          const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

          const stayMinutes =
            (endTime.getTime() - startTime.getTime()) / (1000 * 60);

          const locationInItinerary: LocationInItinerary = {
            id: place._id.toString(),
            name: place.name,
            source: place.location as [number, number],
            order: index + 1,
            image: place.imageUrl,
            description: place.description,
            startTime: startTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            endTime: endTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            stayMinutes: stayMinutes,
            openHours: (place as any).openHours,
          };

          if ((place as any).type === 'attraction') {
            locationInItinerary.description = `Entry Fee: ${
              (place as any).entryFee
            }฿. ${place.description}`;
          } else if ((place as any).type === 'restaurant') {
            locationInItinerary.description = `Cuisine: ${
              (place as any).cuisineType
            }. Contact: ${(place as any).contactInfo}. ${place.description}`;
          } else if ((place as any).type === 'accommodation') {
            locationInItinerary.description = `Facilities: ${
              (place as any).facilities.join(', ')
            }. Star Rating: ${(place as any).starRating}. Redirect: ${
              (place as any).redirectUrl || 'N/A'
            }. ${place.description}`;
          }

          planEntity.itinerary[day].locations.push(locationInItinerary);

          // Update currentTime for the next place, including travel time
          const travelTime = planEntity.itinerary[day].travelTimes[index] || 0;
          currentTime = new Date(endTime.getTime() + travelTime * 60000);
        });
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
