import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
export class LocationInItinerary {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ type: [Number], required: true })
    source: [number, number];

    @Prop({ required: true })
    order: number;

    @Prop()
    startTime: string;

    @Prop()
    endTime: string;

    @Prop()
    stayMinutes: number;

    @Prop()
    openHours: string;

    @Prop()
    image: string;

    @Prop()
    description: string;
}

export const LocationInItinerarySchema = SchemaFactory.createForClass(LocationInItinerary);

@Schema({ _id: false })
export class ItineraryDay {
    @Prop({ required: true })
    dayName: string;

    @Prop({ required: true })
    date: string;

    @Prop()
    description: string;

    @Prop({ type: [LocationInItinerarySchema], default: [] })
    locations: Types.DocumentArray<LocationInItinerary>;

    @Prop({ type: [], default: [] }) // This will store travel times between locations
    travelTimes: any[];
}

export const ItineraryDaySchema = SchemaFactory.createForClass(ItineraryDay);