import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Plan } from '../src/schemas/plan.schema';
import * as testData from '../src/plans/test.json';
import { PlacesService } from 'src/places/places.service';
import { mockPlaces } from 'src/places/mock-places';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Types } from 'mongoose';

describe('PlansController (e2e)', () => {
  let app: INestApplication;

  // Mock the Plan model
  const mockPlanModel = {
    new: jest.fn().mockImplementation(plan => ({
      ...plan,
      save: jest.fn().mockResolvedValue(plan),
    })),
    create: jest.fn(),
    save: jest.fn(),
    countDocuments: jest.fn().mockResolvedValue(0),
    findByIdAndUpdate: jest.fn().mockReturnThis(), // Returns the mock model for chaining
    find: jest.fn().mockReturnThis(), // Returns the mock model for chaining
    findById: jest.fn().mockReturnThis(), // Returns the mock model for chaining
    findByIdAndDelete: jest.fn().mockReturnThis(), // Returns the mock model for chaining
    exec: jest.fn().mockResolvedValue(mockPlaces[0]), // Mock exec for all chained methods
  };

  // Mock PlacesService
  const mockPlacesService = {
    findOne: jest.fn((id) => {
      const place = mockPlaces.find(p => p._id.toString() === id);
      return Promise.resolve(place);
    }),
    findNearbyPlaces: jest.fn().mockResolvedValue(mockPlaces.slice(0, 3)),
    findByName: jest.fn((name: string) => {
      if (name === 'อีสานใต้') {
        return Promise.resolve([mockPlaces[0], mockPlaces[1]]); // Assuming mockPlaces[0] is 'Wat Arun' and mockPlaces[1] is 'Grand Palace'
      } else if (name === 'เชียงใหม่') {
        return Promise.resolve([mockPlaces[2]]);
      }
      return Promise.resolve([]);
    }),
    findDefaultPlaces: jest.fn().mockResolvedValue(mockPlaces.slice(0, 3)), // Mock implementation for findDefaultPlaces
  };

  // Mock JwtAuthGuard
  const mockJwtAuthGuard: CanActivate = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = {
        _id: '60d5ec49f8c7d0001c8c4f01' as any, // Mock ObjectId as string
        role: 'user',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'john.doe',
      } as any as UserDocument; // Mock user
      return true;
    }),
  };

  beforeAll(async () => {
    // Set the NODE_ENV to 'test' to use mock data in services
    process.env.NODE_ENV = 'test';
    process.env.USE_MOCK_DATA = 'true';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(Plan.name))
      .useValue(mockPlanModel)
      .overrideProvider(PlacesService)
      .useValue(mockPlacesService)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/plans (POST) - should create a plan with predefined destinations', () => {
    const withDestinationsCase = testData.find(d => d.case === "User-provided payload example");

    return request(app.getHttpServer())
      .post('/plans')
      .send(withDestinationsCase.data)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.createdPlan.itinerary).toBeDefined();
        
        const itineraryKeys = Object.keys(response.body.createdPlan.itinerary);
        expect(itineraryKeys.length).toBe(3); // 3 days

        // Day 1 should have Wat Arun
        const day1 = response.body.createdPlan.itinerary[itineraryKeys[0]];
        expect(day1.locations.length).toBe(1);
        expect(day1.locations[0].name).toBe("Wat Arun");

        // Day 2 should have Grand Palace
        const day2 = response.body.createdPlan.itinerary[itineraryKeys[1]];
        expect(day2.locations.length).toBe(1);
        expect(day2.locations[0].name).toBe("Grand Palace");
        
        // Day 3 should be empty
        const day3 = response.body.createdPlan.itinerary[itineraryKeys[2]];
        expect(day3.locations.length).toBe(0);

      });
  });

  it('/plans (POST) - should create a plan and set "where" to hotel name if isCurrentLocationHotel is true', async () => {
    mockPlacesService.findNearbyPlaces.mockResolvedValueOnce([
      { name: 'Fake Hotel', type: 'accommodation' },
    ]);
    const hotelCase = testData.find(d => d.case === "Plan with current location as hotel");
    
    return request(app.getHttpServer())
      .post('/plans')
      .send(hotelCase.data)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.createdPlan.where).toBe('Fake Hotel');
      });
  });

  it('/plans (POST) - should suggest destinations when none are provided', () => {
    const withoutDestinationsCase = testData.find(d => d.case === "Minimal Input Plan (source and category only)");

    return request(app.getHttpServer())
      .post('/plans')
      .send(withoutDestinationsCase.data)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.createdPlan.itinerary).toBeDefined();
        
        // Itinerary should be created with some locations from default places
        const itineraryKeys = Object.keys(response.body.createdPlan.itinerary);
        expect(itineraryKeys.length).toBe(3);
        expect(response.body.createdPlan.itinerary[itineraryKeys[0]].locations.length).toBeGreaterThan(0);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});