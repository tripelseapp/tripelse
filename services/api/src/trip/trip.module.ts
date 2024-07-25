import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripEntity, TripSchema } from './entities/trip.entity';
import { TripController } from './controllers/trip.controller';
import { TripService } from './services/trip.service';
import { UserModule } from 'user/user.module';
import { TripUserController } from './controllers/trip-user.controller';

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
  controllers: [TripController, TripUserController],
  providers: [TripService],
})
export class TripModule {}
