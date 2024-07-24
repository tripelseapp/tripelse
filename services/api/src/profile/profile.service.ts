import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileEntity, ProfileDocument } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileEntity.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    try {
      const newProfile = new this.profileModel(createProfileDto);
      return await newProfile.save();
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new InternalServerErrorException('Could not create the profile.');
    }
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDocument> {
    try {
      const updatedProfile = await this.profileModel
        .findOneAndUpdate({ userId }, updateProfileDto, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updatedProfile) {
        throw new NotFoundException('Profile not found for this user');
      }
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new InternalServerErrorException('Could not update the profile.');
    }
  }

  async findAll(): Promise<ProfileDocument[]> {
    try {
      return await this.profileModel.find().exec();
    } catch (error) {
      console.error('Error finding all profiles:', error);
      throw new InternalServerErrorException('Could not find profiles.');
    }
  }
}
