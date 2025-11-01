import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Place } from 'src/schemas/place.schema';
import { TransportMethod } from 'src/schemas/transportMethod.schema';

export class CreatePlanDto {
  @ApiProperty({
    example: 'อีสานใต้',
    description: 'Optional destination or region for the plan',
    required: false,
  })
  @IsOptional()
  @IsString()
  where?: string;

  @ApiProperty({ example: ['ปีนผา', 'ทะเล', 'ธรรมชาติ'] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  category: string[];

  @ApiProperty({ example: 500, required: false })
  @IsOptional()
  @Min(0)
  budget?: number;

  @ApiProperty({ example: 'รถยนต์ส่วนตัว', required: false })
  @IsOptional()
  @IsString()
  transportation?: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @Min(1)
  people?: number;

  @ApiProperty({ example: '2025-09-28', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2025-09-30', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    example: '[100.5018, 13.7563]',
    description:
      'URL of the source location (e.g., from Google Maps) or an array of [longitude, latitude]',
    required: false,
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'number' } }],
  })
  @IsOptional()
  source: any;

  @ApiProperty({
    example: true,
    description: 'Set to true if the source represents the user\'s current location and should be used to determine the "where" field automatically if it\'s a hotel.',
    required: false,
  })
  @IsOptional()
  isCurrentLocationHotel?: boolean;
}

export class UpdatePlanDto {

    @ApiProperty({ example: "69049873acdf59f8f5f4469d" })
    @IsNotEmpty()
    _id: string;
    
    @ApiProperty()
    @IsNotEmpty()
    budget: number;
    
    @ApiProperty()
    @IsNotEmpty()
    ownerId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    
    @ApiProperty()
    @IsNotEmpty()
    category: string[];
    
    @ApiProperty()
    @IsNotEmpty()
    transportation: string;

    @ApiProperty()
    @IsOptional()
    providedCar?: string;
    
    @ApiProperty()
    @IsNotEmpty()
    people: number;
    
    @ApiProperty()
    @IsNotEmpty()
    startDate: string;
    
    @ApiProperty()
    @IsNotEmpty()
    endDate: string;
    
    @ApiProperty()
    @IsNotEmpty()
    itinerary: Record<string, Itinerary>;
    
    @ApiProperty()
    @IsNotEmpty()
    where: string;

    @ApiProperty({ example: [100.5018, 13.7563] })
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    source: number[];
}

export class ClonedPlanDto {
    @ApiProperty()
    @IsNotEmpty()
    originalPlanId: string;

    @ApiProperty({ example: [100.5018, 13.7563] })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    source: number[];
}


class PlaceWithTime extends PartialType(Place) {
    @ApiProperty({ example: "10:00", description: "Start time for the location in HH:mm format" })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startTime?: Date;

    @ApiProperty({ example: "12:00", description: "End time for the location in HH:mm format" })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endTime?: Date;
}

class Itinerary {
    description: string;
    locations: PlaceWithTime[];
}
