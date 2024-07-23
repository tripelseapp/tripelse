import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileEntity, ProfileSchema } from './entities/profile.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProfileEntity.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
