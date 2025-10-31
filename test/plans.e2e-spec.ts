import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Plan } from '../src/schemas/plan.schema';
import * as testData from '../src/plans/test.json';
import { PlacesService } from 'src/places/places.service';
import { mockPlaces } from 'src/places/mock-places';

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
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  // Mock PlacesService
  const mockPlacesService = {
    findOne: jest.fn((id) => {
      const place = mockPlaces.find(p => p._id.toString() === id);
      return Promise.resolve(place);
    }),
    findNearbyPlaces: jest.fn().mockResolvedValue(mockPlaces.slice(0, 3)),
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
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/plans (POST) - should create a plan with predefined destinations', () => {
    const withDestinationsCase = testData.find(d => d.case === "With destinations");

    return request(app.getHttpServer())
      .post('/plans')
      .send(withDestinationsCase.data)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.itinerary).toBeDefined();
        
        const itineraryKeys = Object.keys(response.body.itinerary);
        expect(itineraryKeys.length).toBe(3); // 3 days

        // Day 1 should have Wat Arun
        const day1 = response.body.itinerary[itineraryKeys[0]];
        expect(day1.locations.length).toBe(1);
        expect(day1.locations[0].name).toBe("Wat Arun");

        // Day 2 should have Grand Palace
        const day2 = response.body.itinerary[itineraryKeys[1]];
        expect(day2.locations.length).toBe(1);
        expect(day2.locations[0].name).toBe("Grand Palace");
        
        // Day 3 should be empty
        const day3 = response.body.itinerary[itineraryKeys[2]];
        expect(day3.locations.length).toBe(0);

        expect(response.body.suggestedDestinations).toBeUndefined();
      });
  });

  it('/plans (POST) - should suggest destinations when none are provided', () => {
    const withoutDestinationsCase = testData.find(d => d.case === "Without destinations (suggestion mode)");

    return request(app.getHttpServer())
      .post('/plans')
      .send(withoutDestinationsCase.data)
      .expect(201)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.suggestedDestinations).toBeDefined();
        expect(response.body.suggestedDestinations.length).toBe(3);
        
        // Itinerary should be created but empty
        const itineraryKeys = Object.keys(response.body.itinerary);
        expect(itineraryKeys.length).toBe(3);
        expect(response.body.itinerary[itineraryKeys[0]].locations.length).toBe(0);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});