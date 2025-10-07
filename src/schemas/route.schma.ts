import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TransportMethod } from "./transportMethod.schema";
import mongoose, { Types } from "mongoose";

@Schema()
export class Route {
  @Prop({ required: true, type: Date })
  datetime: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: TransportMethod.name })
  departBy: Types.ObjectId;

  @Prop({ required: true }) //kilometeres
  distance: number;

  @Prop({ required: true }) //minutes
  duration: number;

  @Prop({ required: true })
  to: {
    name: string;
    location: [number, number];
  };
}

export const RouteSchema = SchemaFactory.createForClass(Route);