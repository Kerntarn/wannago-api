import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  private tags = {
  "groupType": [
    "family",
    "with-kids",
    "with-elderly",
    "pet-friendly",
    "couple",
    "solo-travel",
    "friends",
    "large-group",
    "business-trip",
    "digital-nomad"
  ],

  "accommodation": [
    "hotel",
    "resort",
    "villa",
    "hostel",
    "airbnb",
    "camping",
    "glamping",
    "homestay",
    "farmstay",
    "with-gym",
    "with-pool",
    "with-wifi",
    "with-co-working",
    "pet-friendly",
    "near-beach",
    "mountain-view",
    "budget-friendly",
    "luxury",
    "eco-lodge",
    "wellness-retreat",
    "workation"
  ],

  "food": [
    "fine-dining",
    "casual-dining",
    "street-food",
    "local-food",
    "seafood",
    "vegetarian",
    "vegan",
    "halal",
    "buffet",
    "cafe",
    "coffee-specialty",
    "pub-bar",
    "rooftop",
    "farm-to-table"
  ],

  "attractions": [
    "beach",
    "island",
    "mountain",
    "waterfall",
    "lake-river",
    "temple",
    "historical-site",
    "museum",
    "art-gallery",
    "theme-park",
    "zoo",
    "aquarium",
    "night-market",
    "nightlife",
    "shopping-mall",
    "cultural-show",
    "festival",
    "farm",
    "garden-park",
    "hiking-trail",
    "diving-snorkeling",
    "extreme-sport",
    "adventure-park",
    "wellness-spa"
  ],

  "preferences": [
    "budget",
    "luxury",
    "eco-friendly",
    "quiet",
    "adventure",
    "wellness",
    "photogenic",
    "near-transport",
    "remote-area",
    "local-experience",
    "wifi-available",
    "workation",
    "digital-friendly",
    "relaxation",
    "crowded-fun",
    "cultural-immersion",
    "romantic"
  ]
};
  findAll() {
    return this.tags;
  }
}
