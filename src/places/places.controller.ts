import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto, FindPlaceQueryDto } from 'src/places/dtos/place.dto';
import { UpdatePlaceDto } from 'src/places/dtos/place.dto';
import {
  CreateAccommodationDto,
  UpdateAccommodationDto,
} from 'src/places/dtos/accommodation.dto';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from 'src/places/dtos/restaurant.dto';
import {
  CreateAttractionDto,
  UpdateAttractionDto,
} from 'src/places/dtos/attraction.dto';
import { ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@Controller('places')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@ApiExtraModels(
  CreateAccommodationDto,
  CreateRestaurantDto,
  CreateAttractionDto,
)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('accommodation')
  createAcc(
    @Body() createAccommodatinDto: CreateAccommodationDto,
    @CurrentUser() user,
  ) {
    const place = this.placesService.create(
      createAccommodatinDto,
      'Accommodation',
      user,
    );
    return place;
  }

  @Post('attraction')
  createAtt(
    @Body() createAttractionDto: CreateAttractionDto,
    @CurrentUser() user,
  ) {
    const place = this.placesService.create(
      createAttractionDto,
      'Attraction',
      user,
    );
    return place;
  }

  @Post('restaurant')
  createRes(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user,
  ) {
    const place = this.placesService.create(
      createRestaurantDto,
      'Restaurant',
      user,
    );
    return place;
  }

  @Get('all')
  findAllPlaces(@Query('type') t?: FindPlaceQueryDto) {
    if (t) {
      return this.placesService.findAll(t?.type);
    }
    return this.placesService.findAll();
  }

  @Get() // Get by service provider to see their own places
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER)
  findAllByUser(@CurrentUser() user, @Query('type') t?: FindPlaceQueryDto) {
    return this.placesService.findAll(t?.type, user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch('accommodation/:id')
  updateAcc(
    @Param('id') id: string,
    @Body() updateAccommodationDto: UpdateAccommodationDto,
    @CurrentUser() user,
  ) {
    return this.placesService.update(
      id,
      updateAccommodationDto,
      'Accommodation',
      user._id,
    );
  }

  @Patch('attraction/:id')
  updateAtt(
    @Param('id') id: string,
    @Body() updateAttractionDto: UpdateAttractionDto,
    @CurrentUser() user,
  ) {
    console.log('User in updateAtt:', user);
    return this.placesService.update(
      id,
      updateAttractionDto,
      'Attraction',
      user._id,
    );
  }

  @Patch('restaurant/:id')
  updateRes(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user,
  ) {
    return this.placesService.update(
      id,
      updateRestaurantDto,
      'Restaurant',
      user._id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.placesService.remove(id);
  }
}
