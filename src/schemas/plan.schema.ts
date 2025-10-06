import mongoose, { HydratedDocument, Model, ObjectId } from "mongoose";
import { Place } from "./place.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Route, RouteSchema } from "./route.schma";

export type planDocument = HydratedDocument<Plan>;

@Schema({ versionKey: false })
export class Plan{
    @Prop()
    name?: string; // Removed `required: true` since it is auto-filled in the pre-save middleware

    @Prop( {required: true, type: [Number]})
    source: number[];

    @Prop( {required: true, type: Date})
    startTime: Date;
    
    @Prop( {required: true, type: Date})
    endTime: Date;
    
    @Prop( {required: true})
    preferredTags: string[];
    
    @Prop( {required: true})
    budget: number;
    
    @Prop( {required: true, default: 1})
    groupSize?: number;
    
    @Prop( {required: false })
    ownerId: string;

    @Prop( {required: true, type: [RouteSchema] })
    routes: Route[];
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