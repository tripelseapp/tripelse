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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'auth/guards/auth.guard';
import { ReqWithUser, TokenPayload } from 'auth/types/token-payload.type';
import { ApiPaginatedResponse } from 'common/decorators/api-paginated-response.decorator';
import { CreateExpenseDto } from 'common/resources/expenses/dto/create-expense.dto';
import { ExpenseDto } from 'common/resources/expenses/dto/expense.dto';
import {
  Expense,
  expenseExample,
} from 'common/resources/expenses/entities/expense.entity';
import { PageOptionsDto } from 'common/resources/pagination/page-options.dto';
import { PageDto } from 'common/resources/pagination/page.dto';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';
import { CreateTripDto, CreateTripExample } from './dto/trip/create-trip.dto';
import {
  TripDetailsDto,
  tripDetailsExample,
} from './dto/trip/trip-details.dto';
import { TripInListDto } from './dto/trip/trip-list.dto';
import { UpdateTripDto } from './dto/trip/update-trip.dto';
import { TripService } from './trip.service';
import { ResDeleteTrip } from './types/res-delete-trip.type';

@Controller('trip')
@ApiCookieAuth()
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
  @UseGuards(AuthGuard)
  async create(
    @Body() createTripDto: CreateTripDto,
    @Req() req: any,
  ): Promise<TripDetailsDto> {
    const currentUser: TokenPayload = req.user;
    if (!currentUser.sub) {
      // Should never happen because of the AuthGuard
      throw new BadRequestException('User not found');
    }
    const currentUserId = currentUser.sub;

    // add your Id to the travelers array
    const travelers = createTripDto.travelers || [];
    // check if the user is already in the travelers array
    if (!travelers.includes(currentUserId)) {
      travelers.push(currentUserId);
    }

    const newTrip = {
      ...createTripDto,
      travelers: travelers,
    };

    return this.tripService.create(newTrip, currentUser.sub);
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
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseObjectIdPipe) id: string, @Req() req: ReqWithUser) {
    const current = req.user?.sub;
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
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTripDto: UpdateTripDto,
    @Req() req: ReqWithUser,
  ): Promise<TripDetailsDto> {
    return this.tripService.update(id, updateTripDto, req.user.sub);
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
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseObjectIdPipe) id: string): Promise<ResDeleteTrip> {
    return this.tripService.remove(id);
  }

  // Expenses maangement

  @Get(':id/expense')
  @ApiOperation({
    summary: 'Get all expenses of a trip',
    description: 'Returns all expenses of a trip with the provided ID',
  })
  @ApiOkResponse({
    example: tripDetailsExample,
    status: 200,
    description: 'The expenses have been successfully found.',
    type: TripDetailsDto,
  })
  async getExpenses(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ExpenseDto[]> {
    return this.tripService.getExpenses(id);
  }

  // createExpense for a trip
  @Post(':id/expense')
  @ApiOperation({
    summary: 'Create an expense for a trip',
    description: 'Creates an expense for a trip with the provided ID',
  })
  @ApiOkResponse({
    example: expenseExample,
    status: 201,
    description: 'The expense has been successfully created.',
    type: Expense,
  })
  @UseGuards(AuthGuard)
  async createExpense(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: ReqWithUser,
  ): Promise<ExpenseDto> {
    return this.tripService.createExpense(id, createExpenseDto, req.user.sub);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  async getTripsByUserId(@Param('userId', ParseObjectIdPipe) userId: string) {
    const trips = await this.tripService.findByUserId(userId);
    return trips;
  }
  @Get('mine')
  @UseGuards(AuthGuard)
  async getMyTrips(@Req() req: ReqWithUser) {
    console.log(req);
    // const trips = await this.tripService.findByUserId(req.user.sub);
    return 'trips';
    // return trips;
  }
}
