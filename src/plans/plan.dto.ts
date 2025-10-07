import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePlanDto {
    @ApiProperty({ example: [100.5018, 13.7563], description: 'Give me longitude and latitude of source', type: [Number]})
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(2, { message: 'Give me longitude and latitude of source'})
    @ArrayMaxSize(2, { message: 'Give me longitude and latitude of source'})
    source: number[];

    @ApiProperty( {example: 'พัทยา'})
    @IsOptional()
    destination?: string;

    @ApiProperty({format: 'date-time', example: new Date(),})
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startTime?: Date;
    
    @ApiProperty({format: 'date-time', example: new Date(),})
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endTime?: Date;
    
    @ApiProperty({ example: 500 })
    @IsOptional()
    @Min(0)
    budget?: number;
    
    @ApiProperty({example: 1})
    @IsOptional()
    @Min(1)
    groupSize?: number;

    @ApiProperty({example: ['Personal Car', 'Taxi']})
    @IsOptional()
    @IsString( {each: true} ) 
    transit: string[];

    @ApiProperty({example: ["solo-travel"]})
    @IsNotEmpty()
    @IsString({each: true})
    @ArrayMinSize(1)
    preferredTags: string[];
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}