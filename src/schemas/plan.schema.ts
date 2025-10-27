import mongoose, { HydratedDocument, Model } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ItineraryDay, ItineraryDaySchema, LocationInItinerary } from "src/schemas/itinerary.schema";

export type planDocument = HydratedDocument<Plan>;

@Schema({ versionKey: false })
export class Plan{
    @Prop()
    name?: string; // Removed `required: true` since it is auto-filled in the pre-save middleware

    @Prop({ required: true, type: [Number] })
    source: number[];

    @Prop({ required: true })
    preferredTags: string[];

    @Prop({ required: true })
    budget: number;

    @Prop({ required: true, default: 1 })
    groupSize?: number;

    @Prop({ required: false })
    ownerId: string;

    @Prop()
    title: string;

    @Prop({ type: [String] })
    category: string[];

    @Prop()
    transportation: string;

    @Prop({ required: true, default: 1 })
    people: number;

    @Prop({ required: true, type: Date })
    startDate: Date;

    @Prop({ required: true, type: Date })
    endDate: Date;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    itinerary: Record<string, ItineraryDay>;

    @Prop({ type: [String] })
    destinations?: string[];

    @Prop()
    isReturn?: boolean;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    suggestedDestinations?: any;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);


PlanSchema.pre<planDocument>('save', async function (next) {
  if (!this.name) {
    const model = this.constructor as Model<planDocument>;

    const count = await model.countDocuments({ name: /^untitled-/ });
    const nextNumber = count + 1;

    this.name = `untitled-${String(nextNumber).padStart(2, '0')}`;
  }
  next();
});