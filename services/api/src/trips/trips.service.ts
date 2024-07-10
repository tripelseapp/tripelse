import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Trip } from './entities/trip.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TripsService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<Trip>) {}

  create(createTripDto: CreateTripDto) {
    const now = new Date();

    const newTrip = new this.tripModel({
      ...createTripDto,
      createdAt: now,
      updatedAt: now,
    });
    return newTrip.save();
  }

  /**
   *
   * @returns List of all trips
   */
  findAll(): Promise<Trip[]> {
    return this.tripModel.find().exec();
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
