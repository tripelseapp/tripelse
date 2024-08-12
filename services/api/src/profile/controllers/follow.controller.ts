import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from 'profile/services/profile.service';
import { ProfileDocument } from '../entities/profile.entity'; // Adjust import path as necessary
import { ReqWithUser } from 'auth/types/token-payload.type';

@Controller('profile-following')
@ApiTags('Profile / Follow')
export class FollowController {
  constructor(private readonly profileService: ProfileService) {}

  // Follow a user
  @Post(':profileId/follow/:followeeProfileId')
  async followUser(
    @Param('profileId') profileId: string,
    @Param('followeeProfileId') followeeProfileId: string,
  ): Promise<ProfileDocument> {
    try {
      return await this.profileService.followUser(profileId, followeeProfileId);
    } catch (error: any) {
      if (
        error.response &&
        error.response.message === 'Already following this user'
      ) {
        throw new InternalServerErrorException(
          'You are already following this user',
        );
      }
      throw error;
    }
  }
  // Current user follows a user
  @Post('me/follow/:followeeProfileId')
  async meFollowUser(
    @Req() req: ReqWithUser,
    @Param('followeeProfileId') followeeProfileId: string,
  ): Promise<ProfileDocument> {
    const profileId = req.user.profileId;
    if (!profileId) {
      throw new InternalServerErrorException('User does not have a profile');
    }
    try {
      return await this.profileService.followUser(profileId, followeeProfileId);
    } catch (error: any) {
      if (
        error.response &&
        error.response.message === 'Already following this user'
      ) {
        throw new InternalServerErrorException(
          'You are already following this user',
        );
      }
      throw error;
    }
  }

  // Unfollow a user
  @Delete(':profileId/unfollow/:followeeProfileId')
  async unfollowUser(
    @Param('profileId') profileId: string,
    @Param('followeeProfileId') followeeProfileId: string,
  ): Promise<ProfileDocument> {
    try {
      return await this.profileService.unfollowUser(
        profileId,
        followeeProfileId,
      );
    } catch (error: any) {
      if (
        error.response &&
        error.response.message === 'Not following this user'
      ) {
        throw new InternalServerErrorException(
          'You are not following this user',
        );
      }
      throw error;
    }
  }
  @Delete('me/unfollow/:followeeProfileId')
  async meUnfollowUser(
    @Req() req: ReqWithUser,
    @Param('followeeProfileId') followeeProfileId: string,
  ): Promise<ProfileDocument> {
    const profileId = req.user.profileId;
    if (!profileId) {
      throw new InternalServerErrorException('User does not have a profile');
    }
    try {
      return await this.profileService.unfollowUser(
        profileId,
        followeeProfileId,
      );
    } catch (error: any) {
      if (
        error.response &&
        error.response.message === 'Not following this user'
      ) {
        throw new InternalServerErrorException(
          'You are not following this user',
        );
      }
      throw error;
    }
  }

  // Get followers of a user
  @Get(':profileId/followers')
  async getFollowers(
    @Param('profileId') profileId: string,
  ): Promise<ProfileDocument> {
    try {
      return await this.profileService.getFollowers(profileId);
    } catch (error) {
      throw new NotFoundException('Profile not found');
    }
  }
  // Get followers of a user
  @Get('mine/followers')
  async getMyFollowers(@Req() req: ReqWithUser): Promise<ProfileDocument> {
    const profileId = req.user.profileId;
    if (!profileId) {
      throw new InternalServerErrorException('User does not have a profile');
    }
    try {
      return await this.profileService.getFollowers(profileId);
    } catch (error) {
      throw new NotFoundException('Profile not found');
    }
  }

  // Get following of a user
  @Get(':profileId/following')
  async getFollowing(
    @Param('profileId') profileId: string,
  ): Promise<ProfileDocument> {
    try {
      return await this.profileService.getFollowing(profileId);
    } catch (error) {
      throw new NotFoundException('Profile not found');
    }
  }
  @Get('mine/following')
  async getMineFollowing(@Req() req: ReqWithUser): Promise<ProfileDocument> {
    const profileId = req.user.profileId;
    if (!profileId) {
      throw new InternalServerErrorException('User does not have a profile');
    }
    try {
      return await this.profileService.getFollowing(profileId);
    } catch (error) {
      throw new NotFoundException('Profile not found');
    }
  }
}
