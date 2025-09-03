import mongoose, { Date, HydratedDocument, ObjectId } from "mongoose";
import { Place } from "./place.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type planDocument = HydratedDocument<Plan>;

@Schema()
export class Plan{
    @Prop( {required: true})
    name: string;

    @Prop( {required: true})
    destination: string;
    
    @Prop( {required: true, type: mongoose.Schema.Types.Date})
    startTime: Date;
    
    @Prop( {required: true, type: mongoose.Schema.Types.Date})
    endTime: Date;
    
    @Prop( {required: true})
    interest: string[];
    
    @Prop( {required: true})
    budget: number;
    
    @Prop( {required: true})
    groupSize: number;
    
    @Prop( {required: true, type: mongoose.Schema.Types.ObjectId})
    ownerId: ObjectId;

}

export const PlanSchema = SchemaFactory.createForClass(Plan);