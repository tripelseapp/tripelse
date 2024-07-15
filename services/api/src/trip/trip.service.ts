import { Injectable } from '@nestjs/common';

import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Trip } from './entities/trip.entity';
import { FilterQuery, Model } from 'mongoose';
import { buildQuery, buildSorting } from 'src/utils/query-utils';
import { PageMetaDto } from 'src/common/dto/pagination/page-meta.dto';
import { CreateTripDto } from './dto/trip-dtos/create-trip.dto';
import { TripInListDto } from './dto/trip-dtos/trip-list.dto';
import { UpdateTripDto } from './dto/trip-dtos/update-trip.dto';

@Injectable()
export class TripService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<Trip>) {}

  create(createTripDto: CreateTripDto) {
    return 'This action adds a new trip';
  }

  public async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TripInListDto>> {
    const {
      page = 1,
      take = 10,
      orderBy = ['createdAt:ASC'],
      search,
      startDate,
      endDate,
    } = pageOptionsDto;

    const skip = (page - 1) * take;
    const query = buildQuery<Trip>({
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

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }
}
