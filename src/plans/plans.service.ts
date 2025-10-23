import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlanDto, UpdatePlanDto } from 'src/plans/plan.dto';
import { Plan, planDocument } from 'src/schemas/plan.schema';
import { GuestService } from 'src/guest/guest.service';
import { PlacesService } from 'src/places/places.service';
import { TagsService } from 'src/tags/tags.service';
import { PlaceDocument } from 'src/schemas/place.schema';
import { TransportMethodService } from 'src/transport/transportMethod.service';
import { ItineraryDay, LocationInItinerary } from 'src/schemas/itinerary.schema';

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

  findAll() {
    return this.planModel.find().exec();
  }

  findOne(id: string) {
    return this.planModel.findById(id).exec();
  }

  update(id: string, updatePlanDto: UpdatePlanDto) {
    return this.planModel.findByIdAndUpdate(id, updatePlanDto).exec();
  }

  remove(id: string) {
    return this.planModel.findByIdAndDelete(id).exec();
  }


  async generatePlan(dto: CreatePlanDto): Promise<Partial<Plan>> {
    const planEntity: Partial<Plan> = {
      title: dto.title || 'Untitled Plan',
      category: dto.category || [],
      budget: dto.budget,
      transportation: dto.transportation,
      people: dto.people,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      source: dto.source,
      destinations: dto.destinations,
      isReturn: dto.isReturn,
      preferredTags: dto.preferredTags,
      itinerary: {},
    };

    const diffTime = Math.abs(planEntity.endDate.getTime() - planEntity.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (dto.destinations && dto.destinations.length > 0) {
      // Logic for when destinations are provided
      for (let i = 0; i < diffDays; i++) {
        const currentDate = new Date(planEntity.startDate);
        currentDate.setDate(planEntity.startDate.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        const dayName = currentDate.toLocaleString('th-TH', { weekday: 'long' });
        const date = currentDate.toLocaleString('th-TH', { day: 'numeric', month: 'long' });

        const itineraryDay: ItineraryDay = {
          dayName: dayName,
          date: date,
          description: `Day ${i + 1}`,
          locations: [] as any,
          travelTimes: [],
        };

        if (i < dto.destinations.length) {
          const place = await this.placesService.findOne(dto.destinations[i]);
          if (place) {
            itineraryDay.locations.push({
              id: place._id.toString(),
              name: place.name,
              source: place.location,
              order: 1,
              startTime: "10:00",
              endTime: "12:00",
              description: place.description,
              image: place.imageUrl,
            } as LocationInItinerary);
          }
        }
        planEntity.itinerary[dateString] = itineraryDay;
      }
    } else {
      // Logic for when no destinations are provided
      const nearbyPlaces = await this.placesService.findNearbyPlaces(dto.source as [number, number], 3);
      planEntity.suggestedDestinations = nearbyPlaces.map(place => ({
        id: place._id.toString(),
        name: place.name,
        location: place.location,
        description: place.description,
        imageUrl: place.imageUrl,
      }));
       // Create an empty itinerary for the duration
       for (let i = 0; i < diffDays; i++) {
        const currentDate = new Date(planEntity.startDate);
        currentDate.setDate(planEntity.startDate.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        const dayName = currentDate.toLocaleString('th-TH', { weekday: 'long' });
        const date = currentDate.toLocaleString('th-TH', { day: 'numeric', month: 'long' });

        planEntity.itinerary[dateString] = {
          dayName: dayName,
          date: date,
          description: "",
          locations: [] as any,
          travelTimes: [],
        };
      }
    }

    return planEntity;
  }


}
