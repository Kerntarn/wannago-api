import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Plan } from './plan.schema';
//what pattern will the data be saved in db
export type PlaceDocument = HydratedDocument<Place>;
@Schema({
  discriminatorKey: 'type', collection: 'places', versionKey: false
})
export class Place {
  @Prop( { required: true } )
  name: string;

  @Prop( { type: String })
  imageUrl?: string

  @Prop( { required: true, type: [Number] } )
  location: number[];

  @Prop( { type: String } )
  description: string;

  @Prop( { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } )
  providerId: ObjectId;
  
  @Prop()
  tags: string[];


  @Prop({ type: String })
  openHours?: string;

}

export const PlaceSchema = SchemaFactory.createForClass(Place);