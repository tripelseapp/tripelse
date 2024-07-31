import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqWithUser } from 'auth/types/token-payload.type';
import { ApiPaginatedResponse } from 'common/decorators/api-paginated-response.decorator';
import { PageDto, PageOptionsDto } from 'common/resources/pagination';
import { TripInListDto } from 'trip/dto/trip/trip-list.dto';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';
import { TripService } from '../services/trip.service';

@Controller('trip-user')
@ApiCookieAuth()
@ApiTags('Trip-User')
@UseInterceptors(ClassSerializerInterceptor)
export class TripUserController {
  constructor(private readonly tripService: TripService) {}
  @Get(':userId')
  @ApiOperation({
    summary: 'List all trips',
    description: 'Returns an array of all trips. Supports pagination',
  })
  @ApiPaginatedResponse(TripInListDto)
  async getTripsByUserId(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TripInListDto>> {
    const order = pageOptionsDto.orderBy;
    if (typeof order === 'string') {
      pageOptionsDto.orderBy = [order];
    } else if (order && !Array.isArray(order)) {
      throw new BadRequestException('orderBy must be a string or an array');
    }

    // const trips = await this.tripService.findByUserId(userId);
    // const parsedTrips = getTripsInList(trips);
    // return parsedTrips;

    return this.tripService.findByUserId(userId, pageOptionsDto);
  }
  @Get('my-trips')
  @ApiOperation({
    summary: 'List all trips',
    description: 'Returns an array of all trips. Supports pagination',
  })
  @ApiPaginatedResponse(TripInListDto)
  async getMyTrips(
    @Req() req: ReqWithUser,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TripInListDto>> {
    const userId = req.user.id;
    console.log('userId', userId);

    if (!userId) {
      throw new BadRequestException('User not found');
    }

    const order = pageOptionsDto.orderBy;
    if (typeof order === 'string') {
      pageOptionsDto.orderBy = [order];
    } else if (order && !Array.isArray(order)) {
      throw new BadRequestException('orderBy must be a string or an array');
    }

    // const trips = await this.tripService.findByUserId(userId);
    // const parsedTrips = getTripsInList(trips);
    // return parsedTrips;

    return this.tripService.findByUserId(String(userId), pageOptionsDto);
  }
}
