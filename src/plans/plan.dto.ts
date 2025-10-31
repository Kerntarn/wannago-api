import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { Place } from "src/schemas/place.schema";

export class CreatePlanDto {
    @ApiProperty({ example: "อีสานใต้", description: 'Optional destination or region for the plan', required: false })
    @IsOptional()
    @IsString()
    where?: string;

    @ApiProperty({ example: ["ปีนผา", "ทะเล", "ธรรมชาติ"] })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    category: string[];

    @ApiProperty({ example: 500, required: false })
    @IsOptional()
    @Min(0)
    budget?: number;

    @ApiProperty({ example: "รถยนต์ส่วนตัว", required: false })
    @IsOptional()
    @IsString()
    transportation?: string;

    @ApiProperty({ example: 2, required: false })
    @IsOptional()
    @Min(1)
    people?: number;

    @ApiProperty({ example: "2025-09-28", required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ example: "2025-09-30", required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ example: [100.5018, 13.7563], description: 'Give me longitude and latitude of source', type: [Number] , required: false })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(2, { message: 'Give me longitude and latitude of source' })
    @ArrayMaxSize(2, { message: 'Give me longitude and latitude of source' })
    source: number[];
}

export class UpdatePlanDto {

    @ApiProperty({ example: "64b7f8e2c9e77c0015f4d2a1" })
    _id: string;

    @ApiProperty()
    budget: number;
    
    @ApiProperty()
    ownerId: string;
    
    @ApiProperty()
    title: string;
    
    @ApiProperty()
    category: string[];
    
    @ApiProperty()
    transportation: string;
    
    @ApiProperty()
    people: number;

    @ApiProperty()
    startDate: string;

    @ApiProperty()
    endDate: string;

    @ApiProperty()
    itinerary: Record<string, Itinerary>;

    @ApiProperty()
    where: string;
}


class PlaceWithTime extends PartialType(Place) {
    startTime: Date;
    endTime: Date;
}

class Itinerary {
    description: string;
    locations: PlaceWithTime[];
}