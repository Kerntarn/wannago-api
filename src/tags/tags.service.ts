import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  private tags = {
    "groupType": {
      'family': 3,
      "with-kids": 2,
      "with-elderly": 2,
      "pet-friendly": 1,
      'couple': 2,
      "solo-travel": 1,
      'friends': 2,
      "large-group": 1,
      "business-trip": 2,
      "digital-nomad": 2
    },
    "preferences": {
      'budget': 1,
      'luxury': 1,
      'eco-friendly': 1,
      'quiet': 1,
      'adventure': 1,
      'wellness': 1,
      'photogenic': 1,
      'near-transport': 1,
      'remote-area': 1,
      'local-experience': 1,
      'wifi-available': 1,
      'workation': 1,
      'digital-friendly': 1,
      'relaxation': 1,
      'crowded-fun': 1,
      'cultural-immersion': 1,
      'romantic': 1
    },
    "accommodation": {
      'hotel': 1,
      'resort': 1,
      'villa': 1,
      'hostel': 1,
      'airbnb': 1,
      'camping': 1,
      'glamping': 1,
      'homestay': 1,
      'farmstay': 1,
      'with-gym': 1,
      'with-pool': 1,
      'with-wifi': 1,
      'with-co-working': 1,
      'pet-friendly': 1,
      'near-beach': 1,
      'mountain-view': 1,
      'budget-friendly': 1,
      'luxury': 1,
      'eco-lodge': 1,
      'wellness-retreat': 1,
      'workation': 1
    },
    "food": {
      'fine-dining': 1,
      'casual-dining': 1,
      'street-food': 1,
      'local-food': 1,
      'seafood': 1,
      'vegetarian': 1,
      'vegan': 1,
      'halal': 1,
      'buffet': 1,
      'cafe': 1,
      'coffee-specialty': 1,
      'pub-bar': 1,
      'rooftop': 1,
      'farm-to-table': 1
    },
    "attractions": {
      'beach': 1,
      'island': 1,
      'mountain': 1,
      'waterfall': 1,
      'lake-river': 1,
      'temple': 1,
      'historical-site': 1,
      'museum': 1,
      'art-gallery': 1,
      'theme-park': 1,
      'zoo': 1,
      'aquarium': 1,
      'night-market': 1,
      'nightlife': 1,
      'shopping-mall': 1,
      'cultural-show': 1,
      'festival': 1,
      'farm': 1,
      'garden-park': 1,
      'hiking-trail': 1,
      'diving-snorkeling': 1,
      'extreme-sport': 1,
      'adventure-park': 1,
      'wellness-spa': 1
    }
  };
  findAllRecord() {
    const tagLists: Record<string, string[]> = Object.fromEntries(
      Object.entries(this.tags).map(([category, tags]) => [
        category,
        Object.keys(tags) // extract just the tag names
      ])
    );
    return tagLists;
  }

  findAll(){
    const tagLists: string[] = Object.values(this.tags)
      .map(tags => Object.keys(tags))
      .flat();
    return tagLists;
  }

  getWeight(){
    return this.tags;
  }
}
