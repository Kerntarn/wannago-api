import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePlanDto {
    @ApiProperty()
    @IsOptional()
    name?: string;
    
    @ApiProperty()
    @IsNotEmpty()
    destination: string;
    
    @ApiProperty()
    @IsOptional()
    startTime?: Date;
    
    @ApiProperty()
    @IsOptional()
    endTime?: Date;
    
    @ApiProperty()
    @IsOptional()
    interest?: string[];
    
    @ApiProperty()
    @IsOptional()
    budget?: number;
    
    @ApiProperty()
    @IsOptional()
    groupSize?: number;
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}