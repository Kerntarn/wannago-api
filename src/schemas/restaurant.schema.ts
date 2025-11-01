import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Place } from "./place.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema()
export class Restaurant extends Place{
    @Prop( { required: true, type: String})
    openingHours: string;

    @Prop( { required: true, type: String})
    closingHours: string;
     
    @Prop( { required: true})
    cuisineType: string;
     
    @Prop( { required: true})
    contactInfo: string;
     
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);