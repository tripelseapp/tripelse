import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
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
@ApiTags('Trip / User Relationship')
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

    return this.tripService.findByUserId(userId, pageOptionsDto);
  }
  @Get('mine')
  @ApiOperation({
    summary: 'List all trips for the current user',
    description:
      'Returns an array of all trips where the current user is a traveler',
  })
  @ApiPaginatedResponse(TripInListDto)
  async getMyTrips(
    @Query() pageOptionsDto: PageOptionsDto,
    @Req() req: ReqWithUser,
  ): Promise<PageDto<TripInListDto>> {
    const userId = req.user.id;

    if (!userId) {
      throw new BadRequestException('User not found');
    }

    const order = pageOptionsDto.orderBy;
    if (typeof order === 'string') {
      pageOptionsDto.orderBy = [order];
    } else if (order && !Array.isArray(order)) {
      throw new BadRequestException('orderBy must be a string or an array');
    }

    return this.tripService.findByUserId(userId, pageOptionsDto);
  }

  @Patch(':tripId/add/:userId')
  @ApiOperation({
    summary: 'Add a user to a trip',
    description: 'Add a user to a trip',
  })
  async addParticipant(
    @Param('tripId', ParseObjectIdPipe) tripId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ) {
    return this.tripService.addParticipant(tripId, userId);
  }
  @Patch(':tripId/remove/:userId')
  @ApiOperation({
    summary: 'Remove a user from a trip',
    description: 'Remove a user from a trip',
  })
  async removeParticipant(
    @Param('tripId', ParseObjectIdPipe) tripId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ) {
    return this.tripService.removeParticipant(tripId, userId);
  }

  @Patch(':tripId/add/me')
  @ApiOperation({
    summary: 'Add the current logged in user to a trip',
    description: 'Add the current logged in user to a trip',
  })
  async addMeToTrip(
    @Req() req: ReqWithUser,
    @Param('tripId', ParseObjectIdPipe) tripId: string,
  ) {
    console.log('req.user.id', req.user.id);

    return this.tripService.addParticipant(tripId, req.user.id);
  }
}
