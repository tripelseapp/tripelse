import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    try {
      const newProfile = new this.profileModel(createProfileDto);
      return await newProfile.save();
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new InternalServerErrorException('Could not create the profile.');
    }
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    try {
      const profile = await this.profileModel.findOne({ userId }).exec();

      return profile;
    } catch (error) {
      console.error('Error finding profile by userId:', error);
      throw new InternalServerErrorException('Could not find the profile.');
    }
  }

  async findWithUserId(userId: string): Promise<Profile | null> {
    // find the profile but instead of returning the userID:string, we should populate the user object with the user details
    // from the user collection, return the one that matches the userId
    try {
      const profile = await this.profileModel
        .findOne({ userId })
        .populate('user', 'username email')
        .exec();

      return profile;
    } catch (error) {
      console.error('Error finding profile with userId:', error);
      throw new InternalServerErrorException('Could not find the profile.');
    }
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
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
}
