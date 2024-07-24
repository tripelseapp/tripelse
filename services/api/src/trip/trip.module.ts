import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripEntity, TripSchema } from './entities/trip.entity';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TripEntity.name,
        schema: TripSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
