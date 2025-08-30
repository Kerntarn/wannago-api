import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Place } from "./place.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type accommodationDocument = HydratedDocument<Accommodation>;

@Schema()
export class Accommodation extends Place {
    @Prop( { required: true, type: mongoose.Schema.Types.ObjectId} )
    placeId: ObjectId;

    @Prop( { type: [String] } )
    facilities: string[];
    
    @Prop()
    starRating: number;

    @Prop()
    redirectUrl: string;

}

export const AccommodationSchema = SchemaFactory.createForClass(Accommodation);