import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
//what pattern will the data be saved in db
export type PlaceDocument = HydratedDocument<Place>;
@Schema({
  discriminatorKey: 'type', collection: 'places'
})
export class Place {
  @Prop( { required: true } )
  name: string;

  @Prop( { type: String })
  imageUrl: string

  @Prop( { required: true, type: [Number] } )
  location: number[];

  @Prop( { type: String } )
  description: string;

  @Prop() //required ObjectId in the future
  providerId: string;

}

export const PlaceSchema = SchemaFactory.createForClass(Place);