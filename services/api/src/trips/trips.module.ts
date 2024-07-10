import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip, TripSchema } from './entities/trip.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [TripsController],
  providers: [TripsService],
  imports: [
    // Import the MongooseModule into the TripsModule
    // to make the Trip model available to the module
    MongooseModule.forFeature([
      {
        name: Trip.name,
        schema: TripSchema,
      },
    ]),
  ],
})
export class TripsModule {}
