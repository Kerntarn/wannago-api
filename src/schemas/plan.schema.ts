import mongoose, { HydratedDocument, Model } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ItineraryDay, ItineraryDaySchema, LocationInItinerary } from "src/schemas/itinerary.schema";

export type planDocument = HydratedDocument<Plan>;

@Schema({ versionKey: false })
export class Plan{
    @Prop({ required: true, type: [Number] })
    source: number[];

    @Prop({ required: false })
    budget: number;

    @Prop({ required: false })
    ownerId: string;

    @Prop()
    title: string;

    @Prop({ type: [String], required: true })
    category: string[];

    @Prop({ required: false })
    transportation: string;

    @Prop({ required: false, default: 1 })
    people: number;

    @Prop({ required: false, type: Date })
    startDate: Date;

    @Prop({ required: false, type: Date })
    endDate: Date;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    itinerary: Record<string, ItineraryDay>;

    @Prop({ required: false, description: 'The general destination or region for the plan. Can be optional if specific destinations are not yet decided.' })
    where?: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

