import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'common/decorators/api-paginated-response.decorator';
import { TripService } from './trip.service';
import { CreateTripDto, CreateTripExample } from './dto/trip/create-trip.dto';
import { UpdateTripDto } from './dto/trip/update-trip.dto';
import { TripInListDto } from './dto/trip/trip-list.dto';
import { PageOptionsDto } from 'common/resources/pagination/page-options.dto';
import { PageDto } from 'common/resources/pagination/page.dto';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';
import { TripDto } from './dto/trip/trip.dto';
import { Trip } from './entities/trip.entity';
import { TripDetailsDto } from './dto/trip/trip-details.dto';

@Controller('trip')
@ApiTags('Trip')
@UseInterceptors(ClassSerializerInterceptor)
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new trip',
    description: 'Creates a new trip with the provided data',
  })
  @ApiOkResponse({
    example: CreateTripExample,
    status: 201,
    description: 'The trip has been successfully created.',
    type: TripInListDto,
  })
  async create(@Body() createTripDto: CreateTripDto): Promise<TripDto> {
    return this.tripService.create(createTripDto);
  }

  // Find all paginated trips

  @Get()
  @ApiOperation({
    summary: 'List all trips',
    description: 'Returns an array of all trips. Supports pagination',
  })
  @ApiPaginatedResponse(TripInListDto)
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TripInListDto>> {
    if (typeof pageOptionsDto.orderBy === 'string') {
      pageOptionsDto.orderBy = [pageOptionsDto.orderBy];
    } else if (
      pageOptionsDto.orderBy &&
      !Array.isArray(pageOptionsDto.orderBy)
    ) {
      throw new BadRequestException('orderBy must be a string or an array');
    }
    return this.tripService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.tripService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripService.update(+id, updateTripDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes a trip',
    description: 'Deletes a trip with the provided ID',
  })
  @ApiOkResponse({
    example: CreateTripExample,
    status: 201,
    description: 'The trip has been successfully created.',
    type: TripInListDto,
  })
  remove(
    @Param('id', ParseObjectIdPipe) id: TripDto['id'],
  ): Promise<TripDetailsDto> {
    return this.tripService.remove(id);
  }
}
