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
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { TripService } from './trip.service';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { CreateTripDto } from './dto/trip-dtos/create-trip.dto';
import { UpdateTripDto } from './dto/trip-dtos/update-trip.dto';
import { TripInListDto } from './dto/trip-dtos/trip-list.dto';

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
    status: 201,
    description: 'The trip has been successfully created.',
    type: TripInListDto,
  })
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

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
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(+id, updateTripDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}
