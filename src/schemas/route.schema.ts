import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TransportMethod } from "./transportMethod.schema";
import mongoose, { Types } from "mongoose";

@Schema({ _id: false })
class Point {
  @Prop()
  name: string;

  @Prop({ type: [Number, Number] })
  location: [number, number];
}

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

  @Prop({ required: true, type: Point })
  to: Point;
}

export const RouteSchema = SchemaFactory.createForClass(Route);