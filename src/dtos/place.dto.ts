import { ApiProperty } from '@nestjs/swagger';
// What we expect when receiving request
export class CreatePlaceDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  imgaeUrl: string;

  @ApiProperty()
  location: number[];

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: string;

}

export class UpdatePlaceDto {
  @ApiProperty()
  imgaeUrl: string;

  @ApiProperty()
  description: string;

}