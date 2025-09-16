import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePlanDto {
    @ApiProperty()
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(2, { message: 'Give me longitude and latitude'})
    @ArrayMaxSize(2, { message: 'Give me longitude and latitude'})
    source: number[];

    @ApiProperty()
    @IsOptional()
    destination?: string;
    
    @ApiProperty({format: 'date-time', example: '1970-01-01T20:00:00+07:00',})
    @IsOptional()
    @IsDateString()
    startTime?: Date;
    
    @ApiProperty({format: 'date-time', example: '1970-01-01T20:00:00+07:00',})
    @IsOptional()
    @IsDateString()
    endTime?: Date;
    
    @ApiProperty()
    @IsOptional()
    @Min(0)
    budget?: number;
    
    @ApiProperty()
    @IsOptional()
    @Min(1)
    groupSize?: number;

    @ApiProperty()
    @IsOptional()
    @IsString({each: true}) 
    transitId: string[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString({each: true})
    @ArrayMinSize(1)
    preferredTags: string[];
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}