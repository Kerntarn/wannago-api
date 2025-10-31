import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ObjectId } from "mongoose";

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

    _id: string;
    budget: number;
    ownerId: string;
    title: string;
    category: string[];
    transportation: string;
    people: number;
    startDate: string;
    endDate: string;
    itinerary: Record<string, any>;
    where: string;
    startPoint: Record<string, any>;
}