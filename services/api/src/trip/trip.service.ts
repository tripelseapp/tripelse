import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
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
import { Day } from './entities/day.entity';

@Injectable()
export class TripService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<TripDocument>) {}

  public async create(createTripDto: CreateTripDto): Promise<TripDto> {
    const days = getDays(createTripDto.startDate, createTripDto.endDate);

    const completeTrip: Trip = {
      ...createTripDto,
      days,
      thumbnail: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTrip = new this.tripModel(completeTrip);

    try {
      const savedTrip: TripDocument = await newTrip.save();
      if (!savedTrip._id) {
        throw new Error('Error saving trip');
      }
      const userObj = savedTrip.toObject();
      const tripDto: TripDto = {
        ...userObj,
        days: userObj.days.map((day: Day) => ({
          ...day,
          id: day._id.toString(),
          _id: undefined, // Exclude the _id field
        })),
        id: String(userObj._id),
        _id: undefined, // Exclude the _id field
        __v: undefined, // Exclude the __v field
      };
      return plainToInstance(TripDto, tripDto);
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
      fields: ['name'],
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

  findOne(id: number) {
    return `This action returns a #${id} trip`;
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }

  public async remove(id: TripDto['id']): Promise<TripDetailsDto> {
    const trip = await this.tripModel.findByIdAndDelete(id).lean().exec();
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    const tripDetails = getTripDetails(trip);
    return tripDetails;
  }
}
