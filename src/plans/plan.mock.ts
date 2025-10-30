import { Types } from "mongoose";
import { mockPlaces } from "src/places/mock-places";

const getMockNearbyPlaces = () => {
  return mockPlaces.filter((p) => (p as any).type === 'attraction').slice(0, 3).map(place => ({
      id: place._id.toString(),
      name: place.name,
      location: place.location,
      description: place.description,
      imageUrl: place.imageUrl,
  }));
};

const mockNearbyPlaces = getMockNearbyPlaces();

export const PlanMock = {
  id: "plan_001",
  title: "ทริป กรุงเทพฯ",
  category: ["ช้อปปิ้ง", "วัฒนธรรม", "ธรรมชาติ"],
  budget: 500,
  transportation: "รถยนต์ส่วนตัว",
  people: 2,
  startDate: "2025-09-28",
  endDate: "2025-09-30",
  source: [100.5018, 13.7563],
  where: "กรุงเทพฯ",
  itinerary: {
    "2025-09-28": {
      dayName: "วันอาทิตย์",
      date: "28 กันยายน",
      description: "",
      locations: [],
      travelTimes: []
    },
    "2025-09-29": {
      dayName: "วันจันทร์",
      date: "29 กันยายน",
      description: "",
      locations: [],
      travelTimes: []
    },
    "2025-09-30": {
      dayName: "วันอังคาร",
      date: "30 กันยายน",
      description: "",
      locations: [],
      travelTimes: []
    }
  },
  suggestedDestinations: mockNearbyPlaces
};