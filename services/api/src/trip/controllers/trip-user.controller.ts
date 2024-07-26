import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ReqWithUser } from 'auth/types/token-payload.type';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';
import { TripService } from '../services/trip.service';

@Controller('trip-user')
@ApiCookieAuth()
@ApiTags('Trip-User')
@UseInterceptors(ClassSerializerInterceptor)
export class TripUserController {
  constructor(private readonly tripService: TripService) {}

  @Get(':userId')
  async getTripsByUserId(@Param('userId', ParseObjectIdPipe) userId: string) {
    const trips = await this.tripService.findByUserId(userId);
    return trips;
  }
  @Get('mine')
  async getMyTrips(@Req() req: ReqWithUser) {
    console.log(req);
    // const trips = await this.tripService.findByUserId(req.user.id);
    return 'trips';
    // return trips;
  }
}
