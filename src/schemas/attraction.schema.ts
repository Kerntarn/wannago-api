import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Place } from "./place.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type attractionDocument = HydratedDocument<Attraction>;

@Schema()
export class Attraction extends Place {
    @Prop( { required: true, type: mongoose.Schema.Types.ObjectId} )
    placeId: ObjectId;

    @Prop()
    entryFee: number;
}

export const AttractionSchema = SchemaFactory.createForClass(Attraction);