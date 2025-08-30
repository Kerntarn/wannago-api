import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Place } from "./place.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema()
export class Restaurant extends Place {
    @Prop( { required: true, type: mongoose.Schema.Types.ObjectId} )
    placeId: ObjectId;

    @Prop()
    openingHours: string;

    @Prop()
    closingHours: string;
     
    @Prop()
    cuisineType: string;
     
    @Prop()
    contactInfo: string;
     
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);