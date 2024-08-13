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
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReqWithUser, TokenPayload } from 'auth/types/token-payload.type';
import { ApiPaginatedResponse } from 'common/decorators/api-paginated-response.decorator';
import { Public } from 'common/decorators/publicRoute.decorator';
import { PageDto } from 'common/resources/pagination/page.dto';
import { GetAllTripsDto } from 'trip/dto/trip/get-all-trips.dto';
import { UserInList } from 'user/dto/user-list.dto';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';
import { CreateTripDto, CreateTripExample } from '../dto/trip/create-trip.dto';
import {
  TripDetailsDto,
  tripDetailsExample,
} from '../dto/trip/trip-details.dto';
import { TripInListDto } from '../dto/trip/trip-list.dto';
import { UpdateTripDto } from '../dto/trip/update-trip.dto';
import { TripService } from '../services/trip.service';
import { ResponseTripOperation } from '../types/response-trip-operation.type';

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
    example: tripDetailsExample,
    status: 201,
    description: 'The trip has been successfully created.',
    type: TripDetailsDto,
  })
  async create(
    @Body() createTripDto: CreateTripDto,
    @Req() req: ReqWithUser,
  ): Promise<ResponseTripOperation> {
    const currentUser: TokenPayload = req.user;
    if (!currentUser.id) {
      // Should never happen because of the AuthGuard
      throw new BadRequestException('User not found');
    }
    const currentUserId = currentUser.id;

    const emailsToInvite = createTripDto.travelers;

    // add your Id to the travelers array
    const travelers = [currentUserId];

    // travelers will be your ID, the rest of people will be added when they accept the invitation sent by email

    const newTrip: CreateTripDto = {
      ...createTripDto,
      travelers: travelers,
    };

    // send the invitation to the rest of the travelers

    const tripCreated = this.tripService.create(newTrip, currentUser.id);

    if (!tripCreated) {
      throw new BadRequestException('Trip not created');
    }

    const creator: UserInList = {
      id: currentUserId,
      username: currentUser.username,
      profileId: currentUser.profileId,
      avatar: currentUser.avatar,
    };

    emailsToInvite.forEach((email) => {
      this.tripService.sendTripInvitation(email, newTrip, creator);
    });

    return tripCreated;
  }

  // Find all paginated trips

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List all trips',
    description: 'Returns an array of all trips. Supports pagination',
  })
  @ApiPaginatedResponse(TripInListDto)
  async getAll(
    @Query() pageOptionsDto: GetAllTripsDto,
  ): Promise<PageDto<TripInListDto>> {
    const order = pageOptionsDto.orderBy;
    if (typeof order === 'string') {
      pageOptionsDto.orderBy = [order];
    } else if (order && !Array.isArray(order)) {
      throw new BadRequestException('orderBy must be a string or an array');
    }
    return this.tripService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a trip by ID',
    description: 'Returns a trip with the provided ID',
  })
  @ApiOkResponse({
    example: tripDetailsExample,
    status: 200,
    description: 'The trip has been successfully found.',
    type: TripDetailsDto,
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string, @Req() req: ReqWithUser) {
    const current = req.user?.id;
    return this.tripService.findOne(id, current);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a trip',
    description: 'Updates a trip with the provided ID and data',
  })
  @ApiOkResponse({
    example: tripDetailsExample,
    description: 'The trip has been successfully updated.',
    type: TripDetailsDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTripDto: UpdateTripDto,
    @Req() req: ReqWithUser,
  ): Promise<TripDetailsDto> {
    return this.tripService.update(id, updateTripDto, req.user.id);
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
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ResponseTripOperation> {
    return this.tripService.remove(id);
  }

  // Expenses maangement

  // @Get(':id/expense')
  // @ApiOperation({
  //   summary: 'Get all expenses of a trip',
  //   description: 'Returns all expenses of a trip with the provided ID',
  // })
  // @ApiOkResponse({
  //   example: tripDetailsExample,
  //   status: 200,
  //   description: 'The expenses have been successfully found.',
  //   type: TripDetailsDto,
  // })
  // async getExpenses(
  //   @Param('id', ParseObjectIdPipe) id: string,
  // ): Promise<ExpenseDto[]> {
  //   return this.tripService.getExpenses(id);
  // }

  // // createExpense for a trip
  // @Post(':id/expense')
  // @ApiOperation({
  //   summary: 'Create an expense for a trip',
  //   description: 'Creates an expense for a trip with the provided ID',
  // })
  // @ApiOkResponse({
  //   example: expenseExample,
  //   status: 201,
  //   description: 'The expense has been successfully created.',
  //   type: Expense,
  // })
  // async createExpense(
  //   @Param('id', ParseObjectIdPipe) id: string,
  //   @Body() createExpenseDto: CreateExpenseDto,
  //   @Req() req: ReqWithUser,
  // ): Promise<ExpenseDto> {
  //   return this.tripService.createExpense(id, createExpenseDto, req.user.id);
  // }
}
