import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { ExpenseDto } from 'common/resources/expenses/dto/expense.dto';
import {
  Expense,
  ExpenseDocument,
} from 'common/resources/expenses/entities/expense.entity';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'common/resources/pagination';
import { FilterQuery, Model } from 'mongoose';
import { buildQuery, buildSorting } from 'utils/query-utils';
import { CreateTripDto } from './dto/trip/create-trip.dto';
import { TripDetailsDto } from './dto/trip/trip-details.dto';
import { TripInListDto } from './dto/trip/trip-list.dto';
import { TripDto } from './dto/trip/trip.dto';
import { UpdateTripDto } from './dto/trip/update-trip.dto';
import { Trip, TripDocument } from './entities/trip.entity';
import { getDays } from './utils/create-days';
import { getTripDetails } from './utils/get-trip-details';
import { createExpenseFromDto } from 'common/resources/expenses/utils/createExpenseFromDto.util';
import { CreateExpenseDto } from 'common/resources/expenses/dto/create-expense.dto';
import { map } from 'rxjs';

@Injectable()
export class TripService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<TripDocument>) {}

  public async create(createTripDto: CreateTripDto): Promise<TripDetailsDto> {
    const days = getDays(createTripDto.startDate, createTripDto.endDate);

    const completeTrip: Trip = {
      ...createTripDto,
      days,
      travelers: [],
      thumbnail: '',
      expenses: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTrip = new this.tripModel(completeTrip);

    try {
      const savedTrip: TripDocument = await newTrip.save();
      if (!savedTrip._id) {
        throw new Error('Id not generated');
      }
      const tripDetails = getTripDetails(savedTrip);

      return plainToInstance(TripDto, tripDetails);
    } catch (error) {
      console.error('Error saving trip:', error);
      throw new Error('Error saving trip');
    }
  }

  public async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TripInListDto>> {
    const {
      page = 1,
      take = 10,
      orderBy = ['createdAt:DESC'],
      search,
      startDate,
      endDate,
    } = pageOptionsDto;

    const skip = (page - 1) * take;
    const query = buildQuery<TripDocument>({
      model: this.tripModel,
      filters: { search, startDate, endDate },
      searchIn: ['name', 'description'],
      fields: ['name', 'description', 'thumbnail'],
    });

    const trpisQuery = query
      .skip(skip)
      .limit(take)
      .lean()
      .sort(buildSorting(orderBy));

    try {
      const [trips, itemCount]: [FilterQuery<Trip>[], number] =
        await Promise.all([
          trpisQuery.exec(),
          this.tripModel.countDocuments().exec(),
        ]);

      const formattedTrips: TripInListDto[] = trips.map((trip) => ({
        id: trip._id.toString(),
        name: trip.name,
        description: trip.description,
        thumbnail: trip.thumbnail,
      }));

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(formattedTrips, pageMetaDto);
    } catch (error) {
      if (error instanceof Error) {
        const message = `Error while fetching users. Error: ${error.message}`;
        throw new Error(message);
      }
      throw new Error('Error while fetching users.');
    }
  }

  public async findOne(id: string) {
    const trip = await this.tripModel
      .findById(id)
      .populate({ path: 'travelers', model: 'User' })
      .lean()
      .exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    const tripDetails = getTripDetails(trip);

    return tripDetails;
  }

  public async update(
    id: string,
    updateTripDto: Partial<UpdateTripDto>,
  ): Promise<TripDetailsDto> {
    const trip = await this.tripModel
      .findByIdAndUpdate(id, updateTripDto, { new: true })
      .lean()
      .exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    // the return value of findByIdAndUpdate is the document before the update
    const tripDetails = getTripDetails(trip);
    return tripDetails;
  }

  public async remove(id: TripDto['id']): Promise<TripDetailsDto> {
    const trip = await this.tripModel.findByIdAndDelete(id).lean().exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    const tripDetails = getTripDetails(trip);
    return tripDetails;
  }

  public async getExpenses(id: string): Promise<ExpenseDto[]> {
    const trip = await this.tripModel.findById(id).lean().exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    const tripParsed = trip;

    // we need to get all the expenses from the:
    // - trip itself
    // - all the day`s events
    // - all the event's activities

    const tripExpenses = tripParsed.expenses;

    const days = tripParsed.days;
    const eventExpenses: Expense[] = [];
    const activityExpenses: Expense[] = [];

    days.forEach((day) => {
      day.events.forEach((event) => {
        eventExpenses.push(...event.expenses);
        event.activities.forEach((activity) => {
          activityExpenses.push(...activity.expenses);
        });
      });
    });

    const allExpenses: Expense[] = [
      ...tripExpenses,
      ...eventExpenses,
      ...activityExpenses,
    ];

    const parseExpense = (expense: ExpenseDocument) => {
      console.log(expense.contributors[0]);
      return {
        ...plainToInstance(ExpenseDto, expense),
        id: expense._id.toString(),
        _id: undefined,
      };
    };

    const parseExpensesToDto: ExpenseDto[] = allExpenses.map((expense: any) =>
      parseExpense(expense),
    );

    return parseExpensesToDto;
  }

  public async createExpense(
    tripId: string,
    createExpenseDto: CreateExpenseDto,
  ): Promise<ExpenseDto> {
    // update the trip with the new expense

    const trip = await this.tripModel.findById(tripId).exec();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const expense = createExpenseFromDto(createExpenseDto);

    trip.expenses.push(expense);
    const newTrip = await this.update(
      tripId,
      trip.toObject() as Partial<UpdateTripDto>,
    );

    const newExpense = newTrip.expenses[newTrip.expenses.length - 1];

    const parsedExpense = plainToInstance(ExpenseDto, newExpense);

    return parsedExpense;
  }
}
