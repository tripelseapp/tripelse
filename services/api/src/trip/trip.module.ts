import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './entities/trip.entity';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Trip.name,
        schema: TripSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
