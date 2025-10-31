import { Types } from "mongoose";
import { mockPlaces } from "src/places/mock-places";
import { Place } from "src/schemas/place.schema"; // Import Place schema

// Helper to simulate findNearbyPlaces for Bangkok source
const getMockNearbyPlaces = () => {
    return mockPlaces.filter((p: any) => p.type === 'attraction').slice(0, 3).map(place => ({
        id: place._id.toString(),
        name: place.name,
        location: place.location,
        description: place.description,
        imageUrl: place.imageUrl,
    }));
};

const mockNearbyPlaces = getMockNearbyPlaces();

export const mockPlanResults = [
    {
        case: "Minimal Input Plan (source and category only)",
        input: {
            "category": ["ธรรมชาติ", "ผจญภัย"],
            "source": [100.5018, 13.7563]
        },
        expectedOutput: {
            "_id": new Types.ObjectId("65275a5e3620e67160ad300A"), // Mock ID
            "name": "untitled-01",
            "source": [100.5018, 13.7563],
            "ownerId": "mockOwnerId123",
            "title": "ทริป ไร้ชื่อ",
            "category": ["ธรรมชาติ", "ผจญภัย"],
            "people": 1, // Default from schema
            "startDate": new Date().toISOString().split('T')[0] + "T00:00:00.000Z", // Mock current date
            "endDate": new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + "T00:00:00.000Z", // Mock current date + 2 days
            "itinerary": {
                [new Date().toISOString().split('T')[0]]: {
                    "dayName": new Date().toLocaleString('th-TH', { weekday: 'long' }),
                    "date": new Date().toLocaleString('th-TH', { day: 'numeric', month: 'long' }),
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                },
                [new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
                    "dayName": new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleString('th-TH', { weekday: 'long' }),
                    "date": new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleString('th-TH', { day: 'numeric', month: 'long' }),
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                },
                [new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
                    "dayName": new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString('th-TH', { weekday: 'long' }),
                    "date": new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString('th-TH', { day: 'numeric', month: 'long' }),
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                }
            },
            "suggestedDestinations": mockNearbyPlaces
        }
    },
    {
        case: "Plan with all optional fields",
        input: {
            "where": "เชียงใหม่",
            "category": ["วัฒนธรรม", "อาหาร"],
            "budget": 3000,
            "transportation": "เครื่องบิน",
            "people": 3,
            "startDate": "2025-11-15",
            "endDate": "2025-11-18",
            "source": [100.5018, 13.7563]
        },
        expectedOutput: {
            "_id": new Types.ObjectId("65275a5e3620e67160ad300B"), // Mock ID
            "name": "untitled-01",
            "source": [100.5018, 13.7563],
            "budget": 3000,
            "ownerId": "mockOwnerId123",
            "title": "ทริป เชียงใหม่",
            "category": ["วัฒนธรรม", "อาหาร"],
            "transportation": "เครื่องบิน",
            "people": 3,
            "startDate": "2025-11-15T00:00:00.000Z",
            "endDate": "2025-11-18T00:00:00.000Z",
            "itinerary": {
                "2025-11-15": {
                    "dayName": "วันเสาร์",
                    "date": "15 พฤศจิกายน",
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                },
                "2025-11-16": {
                    "dayName": "วันอาทิตย์",
                    "date": "16 พฤศจิกายน",
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                },
                "2025-11-17": {
                    "dayName": "วันจันทร์",
                    "date": "17 พฤศจิกายน",
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                },
                "2025-11-18": {
                    "dayName": "วันอังคาร",
                    "date": "18 พฤศจิกายน",
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                }
            },
            "suggestedDestinations": mockNearbyPlaces,
            "where": "เชียงใหม่"
        }
    },
    {
        case: "User-provided payload example",
        input: {
            "where": "อีสานใต้",
            "category": [
                "ปีนผา",
                "ทะเล",
                "ธรรมชาติ"
            ],
            "budget": 500,
            "transportation": "รถยนต์ส่วนตัว",
            "people": 2,
            "startDate": "2025-09-28",
            "endDate": "2025-09-30",
            "source": [
                100.5018,
                13.7563
            ]
        },
        expectedOutput: {
            "_id": new Types.ObjectId("65275a5e3620e67160ad300C"), // Mock ID
            "name": "untitled-01",
            "source": [100.5018, 13.7563],
            "budget": 500,
            "ownerId": "mockOwnerId123",
            "title": "ทริป อีสานใต้",
            "category": [
                "ปีนผา",
                "ทะเล",
                "ธรรมชาติ"
            ],
            "transportation": "รถยนต์ส่วนตัว",
            "people": 2,
            "startDate": "2025-09-28T00:00:00.000Z",
            "endDate": "2025-09-30T00:00:00.000Z",
            "itinerary": {
                "2025-09-28": {
                    "dayName": "วันอาทิตย์",
                    "date": "28 กันยายน",
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                },
                "2025-09-29": {
                    "dayName": "วันจันทร์",
                    "date": "29 กันยายน",
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                },
                "2025-09-30": {
                    "dayName": "วันอังคาร",
                    "date": "30 กันยายน",
                    "description": "",
                    "locations": [],
                    "travelTimes": []
                }
            },
            "suggestedDestinations": mockNearbyPlaces,
            "where": "อีสานใต้"
        }
    }
];