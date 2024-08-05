import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isObjectIdOrHexString } from 'mongoose';
import {
  SavedTripsDocument,
  SavedTripsEntity,
} from 'profile/entities/saved-trips.entity';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileDocument, ProfileEntity } from '../entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(SavedTripsEntity.name)
    private savedTripsModel: Model<SavedTripsDocument>,
    @InjectModel(ProfileEntity.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    try {
      const newProfileData = {
        ...createProfileDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteTrips: [],
      };
      const newProfile = new this.profileModel(newProfileData);
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

  async createSavedTripFolder(
    profileId: string,
    folderName: string,
    initialTrips: string[],
  ): Promise<ProfileDocument> {
    if (!isObjectIdOrHexString(profileId)) {
      throw new NotFoundException('Invalid profile ID');
    }

    // check the user has no folder with the same name
    const profile = await this.profileModel.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    const folderExists = profile.savedTrips.some(
      (folder) => folder.name === folderName,
    );
    if (folderExists) {
      throw new NotFoundException('Folder with the same name already exists');
    }
    const newFolder: SavedTripsEntity = {
      name: folderName,
      trips: initialTrips,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // save folder to savedTrips collection
    const savedFolder = new this.savedTripsModel(newFolder);

    const newSavedFolder = await savedFolder.save();
    // save folder to profile document

    const newProfile = (await this.profileModel
      .findByIdAndUpdate(
        profileId,
        { $push: { savedTrips: newSavedFolder } },
        { new: true },
      )
      .populate('savedTrips')) as any;

    // return updated user document

    return newProfile;
  }

  async getSavedTripFolder(folderId: string): Promise<SavedTripsDocument> {
    if (!isObjectIdOrHexString(folderId)) {
      throw new NotFoundException('Invalid folder ID');
    }

    const folder = await this.savedTripsModel.findById(folderId).populate({
      path: 'trips',
      model: 'TripEntity',
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    return folder;
  }

  async deleteSavedTripFolder(folderId: string) {
    if (!isObjectIdOrHexString(folderId)) {
      throw new NotFoundException('Invalid folder ID');
    }

    const folder = await this.savedTripsModel.findById(folderId);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const deletedFolder = await this.savedTripsModel.findByIdAndDelete(
      folderId,
    );

    if (!deletedFolder) {
      throw new NotFoundException('Folder not found');
    }

    return deletedFolder;
  }

  async listMySavedTrips(profileId: string): Promise<ProfileDocument> {
    if (!isObjectIdOrHexString(profileId)) {
      throw new NotFoundException('Invalid profile ID');
    }

    const profile = await this.profileModel.findById(profileId).populate({
      path: 'savedTrips',
      populate: {
        path: 'trips',
        model: 'TripEntity',
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async removeTripFromFolder(
    folderId: string,
    tripIds: string[],
  ): Promise<SavedTripsDocument> {
    if (!isObjectIdOrHexString(folderId)) {
      throw new NotFoundException('Invalid folder ID');
    }

    const folder = await this.savedTripsModel.findById(folderId);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const updatedFolder = await this.savedTripsModel.findByIdAndUpdate(
      folderId,
      { $pull: { trips: { $in: tripIds } } },
      { new: true },
    );

    if (!updatedFolder) {
      throw new NotFoundException('Folder not found');
    }

    return updatedFolder;
  }

  async addTripToFolder(
    folderId: string,
    tripIds: string[],
  ): Promise<SavedTripsDocument> {
    if (!isObjectIdOrHexString(folderId)) {
      throw new NotFoundException('Invalid folder ID');
    }

    // validate if the folder exists
    const folder = await this.savedTripsModel.findById(folderId);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    // check if the folder already has the trip
    const existingTrips = folder.trips;
    const newTrips = tripIds.filter((id) => !existingTrips.includes(id));
    if (newTrips.length === 0) {
      throw new NotFoundException('Trip already exists in the folder');
    }

    const updatedFolder = await this.savedTripsModel.findByIdAndUpdate(
      folderId,
      { $push: { trips: { $each: tripIds } } },
      { new: true },
    );

    if (!updatedFolder) {
      throw new NotFoundException('Folder not found');
    }

    return updatedFolder;
  }

  // FOLLOW

  async followUser(
    profileId: string,
    followeeProfileId: string,
  ): Promise<ProfileDocument> {
    if (
      !isObjectIdOrHexString(profileId) ||
      !isObjectIdOrHexString(followeeProfileId)
    ) {
      throw new NotFoundException('Invalid profile ID');
    }

    const profile = await this.profileModel.findById(profileId).exec();
    const followeeProfile = await this.profileModel
      .findById(followeeProfileId)
      .exec();

    if (!profile || !followeeProfile) {
      throw new NotFoundException('Profile or followee not found');
    }

    // Check if the user is already following
    if (profile.following.includes(followeeProfileId)) {
      throw new InternalServerErrorException('Already following this user');
    }

    // Add followeeProfileId to following list
    profile.following.push(followeeProfileId);
    await profile.save();

    // Add profileId to followers list of followee
    followeeProfile.followers.push(profileId);
    await followeeProfile.save();

    return profile;
  }
  /**
   *  Removing a Follower - This method will allow a profile to unfollow another profile:
   * @returns  ProfileDocument
   */
  async unfollowUser(
    profileId: string,
    followeeProfileId: string,
  ): Promise<ProfileDocument> {
    if (
      !isObjectIdOrHexString(profileId) ||
      !isObjectIdOrHexString(followeeProfileId)
    ) {
      throw new NotFoundException('Invalid profile ID');
    }

    const profile = await this.profileModel.findById(profileId).exec();
    const followeeProfile = await this.profileModel
      .findById(followeeProfileId)
      .exec();

    if (!profile || !followeeProfile) {
      throw new NotFoundException('Profile or followee not found');
    }

    // Check if the user is already not following
    if (!profile.following.includes(followeeProfileId)) {
      throw new InternalServerErrorException('Not following this user');
    }

    // Remove followeeProfileId from following list
    profile.following = profile.following.filter(
      (id) => id.toString() !== followeeProfileId,
    );
    await profile.save();

    // Remove profileId from followers list of followee
    followeeProfile.followers = followeeProfile.followers.filter(
      (id) => id.toString() !== profileId,
    );
    await followeeProfile.save();

    return profile;
  }
  /**
   * Fetching Followers and Following Lists - This method will allow fetching the followers and following lists of a profile
   */
  async getFollowers(profileId: string): Promise<ProfileDocument> {
    if (!isObjectIdOrHexString(profileId)) {
      throw new NotFoundException('Invalid profile ID');
    }

    const profile = await this.profileModel
      .findById(profileId)
      .populate('followers')
      .exec();

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getFollowing(profileId: string): Promise<ProfileDocument> {
    if (!isObjectIdOrHexString(profileId)) {
      throw new NotFoundException('Invalid profile ID');
    }

    const profile = await this.profileModel
      .findById(profileId)
      .populate('following')
      .exec();

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
