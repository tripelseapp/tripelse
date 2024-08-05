import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './controllers/profile.controller';
import { ProfileEntity, ProfileSchema } from './entities/profile.entity';
import {
  SavedTripsEntity,
  SavedTripsSchema,
} from './entities/saved-trips.entity';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedTripsEntity.name, schema: SavedTripsSchema },
      { name: ProfileEntity.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
