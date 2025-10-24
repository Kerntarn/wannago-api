import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePlanDto {
    @ApiProperty({ example: "เที่ยวกรุงเทพ...แบบชิลๆ" })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ example: ["ปีนผา", "ทะเล", "ธรรมชาติ"] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    category?: string[];

    @ApiProperty({ example: 500 })
    @IsOptional()
    @Min(0)
    budget?: number;

    @ApiProperty({ example: "รถยนต์ส่วนตัว" })
    @IsOptional()
    @IsString()
    transportation?: string;

    @ApiProperty({ example: 2 })
    @IsOptional()
    @Min(1)
    people?: number;

    @ApiProperty({ example: "2025-09-28" })
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: "2025-09-30" })
    @IsNotEmpty()
    @IsDateString()
    endDate: string;

    @ApiProperty({ example: [100.5018, 13.7563], description: 'Give me longitude and latitude of source', type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(2, { message: 'Give me longitude and latitude of source' })
    @ArrayMaxSize(2, { message: 'Give me longitude and latitude of source' })
    source: number[];

    @ApiProperty({ example: ["solo-travel"] })
    @IsNotEmpty()
    @IsString({ each: true })
    @ArrayMinSize(1)
    preferredTags: string[];

    @ApiProperty({ example: ["ChIJI_Yv-4uC4jAR23-A2f-3-4A", "ChIJ-5-d_5aC4jARc-w-A2f-3-4A"], description: 'An array of Google Place IDs for the destinations', required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    destinations?: string[];

    @ApiProperty({ example: true, description: 'Is this a round trip?', required: false })
    @IsOptional()
    isReturn?: boolean;
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}