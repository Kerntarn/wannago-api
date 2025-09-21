import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreatePlanDto {
    @ApiProperty()
    @IsOptional()
    name?: string;
    
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
    preferredTags: string[];
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}