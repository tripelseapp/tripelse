import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './controllers/profile.controller';
import { ProfileEntity, ProfileSchema } from './entities/profile.entity';
import {
  SavedTripsEntity,
  SavedTripsSchema,
} from './entities/saved-trips.entity';
import { ProfileService } from './services/profile.service';
import { SavedTripsController } from './controllers/SavedTripsFolder.controller';
import { FollowController } from './controllers/follow.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedTripsEntity.name, schema: SavedTripsSchema },
      { name: ProfileEntity.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [ProfileController, SavedTripsController, FollowController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
