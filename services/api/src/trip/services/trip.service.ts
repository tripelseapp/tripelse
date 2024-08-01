import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
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
import { FilterQuery, Model, Types } from 'mongoose';
import { getTripsInList } from 'trip/utils/get-trip-list';
import { UserDto } from 'user/dto/user.dto';
import { buildQueryWithCount, buildSorting } from 'utils/query-utils';
import { CreateTripDto } from '../dto/trip/create-trip.dto';
import { TripDetailsDto } from '../dto/trip/trip-details.dto';
import { TripInListDto } from '../dto/trip/trip-list.dto';
import { TripDto } from '../dto/trip/trip.dto';
import { UpdateTripDto } from '../dto/trip/update-trip.dto';
import { TripDocument, TripEntity } from '../entities/trip.entity';
import { ResponseTripOperation } from '../types/response-trip-operation.type';
import { getDays } from '../utils/create-days';
import { getTripDetails } from '../utils/get-trip-details';
import { UserService } from 'user/services/user.service';
import { TypedEventEmitter } from 'event-emitter/typed-event-emitter.class';

@Injectable()
export class TripService {
  constructor(
    @InjectModel(TripEntity.name)
    private readonly tripModel: Model<TripDocument>,
    private readonly userService: UserService,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}
  /**
   * Creates a new trip.
   * @param createTripDto DTO containing trip details.
   * @returns ResponseTripOperation object.
   */
  public async create(
    createTripDto: CreateTripDto,
    createdById: string,
  ): Promise<ResponseTripOperation> {
    const days = getDays(createTripDto.startDate, createTripDto.endDate);

    const completeTrip: TripEntity = {
      ...createTripDto,
      days,
      thumbnail: '',
      createdBy: createdById,
      moods: createTripDto.moods || [],
      purposes: createTripDto.purposes || [],
      logistics: createTripDto.logistics || [],
      travelers: [createdById],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTrip = new this.tripModel(completeTrip);

    try {
      const savedTrip: TripDocument = await newTrip.save();

      if (!savedTrip._id) {
        throw new HttpException('Error creating trip', 500);
      }

      return {
        ok: true,
        message: 'Trip created successfully',
        id: savedTrip._id.toString(),
      };
    } catch (error) {
      console.error('Error creating trip:', error);
      throw new HttpException('Error creating trip', 500);
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
    const { query, countQuery } = buildQueryWithCount<TripDocument>({
      model: this.tripModel,
      filters: { search, startDate, endDate },
      searchIn: ['name', 'description'],
      fields: ['name', 'description', 'thumbnail', 'travelers'],
    });

    const tripsQuery = query
      .skip(skip)
      .limit(take)
      .populate({
        path: 'travelers',
        select: 'username profile',
        populate: {
          path: 'profile',
          select: 'avatar',
        },
      })
      .lean()
      .sort(buildSorting(orderBy));

    try {
      const [trips, itemCount]: [FilterQuery<TripEntity>[], number] =
        await Promise.all([
          tripsQuery.exec(),
          countQuery.countDocuments().exec(),
        ]);

      const formattedTrips: TripInListDto[] = getTripsInList(
        trips as unknown as TripDocument[],
      );

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

  public async findOne(id: string, userId: string): Promise<TripDetailsDto> {
    const trip = await this.tripModel
      .findById(id)
      // get the user from the createdBy id and then get the profile from the user
      .populate({
        path: 'createdBy',
        select: 'username profile',
        populate: {
          path: 'profile',
          select: 'avatar',
        },
      })
      .populate({
        path: 'travelers',
        select: 'username profile',
        populate: {
          path: 'profile',
          select: 'avatar',
        },
      })
      .lean()
      .exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const tripDetails = this.buildTripDetails(trip, userId);

    return tripDetails;
  }

  public async update(
    id: string,
    updateTripDto: Partial<UpdateTripDto>,
    currentUserId: UserDto['id'],
  ): Promise<TripDetailsDto> {
    const trip = await this.tripModel
      .findByIdAndUpdate(id, updateTripDto, { new: true })
      .lean()
      .exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    // the return value of findByIdAndUpdate is the document before the update
    const tripDetails = this.buildTripDetails(trip, currentUserId);
    return tripDetails;
  }

  public async remove(id: TripDto['id']): Promise<ResponseTripOperation> {
    try {
      const trip = await this.tripModel.deleteOne({ _id: id }).lean().exec();
      if (!trip) {
        throw new NotFoundException('Trip not found');
      }
      const response = {
        ok: true,
        message: 'Trip deleted successfully',
        id: id.toString(),
      };
      return response;
    } catch (error) {
      const response = {
        ok: false,
        message: 'Error deleting trip',
        id: id.toString(),
      };
      return response;
    }
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
      return {
        ...expense.toObject(),
        id: expense._id.toString(),
        _id: undefined,
      };
    };

    const parseExpensesToDto: ExpenseDto[] = allExpenses.map((expense: any) =>
      parseExpense(expense),
    );

    return parseExpensesToDto;
  }

  public async findByUserId(
    userId: string,
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
    const userIdObjectId = new Types.ObjectId(userId); // Correct instantiation

    const filters = {
      search,
      startDate,
      endDate,
      travelers: [userIdObjectId], // Ensure this is an array for $in
    };

    const { query, countQuery } = buildQueryWithCount<TripDocument>({
      model: this.tripModel,
      filters,
      searchIn: ['name', 'description'],
      fields: ['name', 'description', 'thumbnail', 'travelers'],
    });
    const tripsQuery = query
      .skip(skip)
      .limit(take)
      .populate({
        path: 'travelers',
        select: 'username profile',
        populate: {
          path: 'profile',
          select: 'avatar',
        },
      })
      .lean()
      .sort(buildSorting(orderBy));

    try {
      const [trips, itemCount]: [TripDocument[], number] = await Promise.all([
        tripsQuery.exec(),
        countQuery.countDocuments().exec(),
      ]);

      const formattedTrips: TripInListDto[] = getTripsInList(trips);

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

  public buildTripDetails(
    trip: TripDocument,
    currentUserId: string,
  ): TripDetailsDto {
    const firstDay = trip.days[0].date;
    const lastDay = trip.days[trip.days.length - 1].date;
    const isTodayInTrip = firstDay <= new Date() && new Date() <= lastDay;
    const tripMembers = trip.travelers.map((member) => member.toString()) || [];
    const areYouMember = tripMembers.includes(currentUserId);

    const metadata = {
      active: isTodayInTrip,
      areYouMember: areYouMember,
    };

    return getTripDetails(trip, metadata);
  }
  public async sendTripInvitation(
    email: string,
    trip: CreateTripDto,
    currentUserId: string,
  ) {
    const user = await this.userService.findUser({ email });

    if (!user) {
      this.eventEmitter.emit('trip.invitation', { email, trip, currentUserId });
    } else {
      this.eventEmitter.emit('trip.invitation', { email, trip, currentUserId });
    }
  }
}
