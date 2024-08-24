import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqWithUser } from 'auth/types/token-payload.type';
import { ProfileInListDto } from 'profile/dto/profile-list.dto';
import { ProfileService } from 'profile/services/profile.service';
import { getProfilesInList } from 'profile/utils/get-profile-list';
import { ProfileDocument } from '../entities/profile.entity'; // Adjust import path as necessary

@Controller('follow')
@ApiTags('Profile / Follow')
export class FollowController {
  constructor(private readonly profileService: ProfileService) {}

  // // Follow a user
  // @Post(':profileId/follow/:followeeProfileId')
  // async followUser(
  //   @Param('profileId') profileId: string,
  //   @Param('followeeProfileId') followeeProfileId: string,
  // ): Promise<ProfileDocument> {
  //   try {
  //     return await this.profileService.followUser(profileId, followeeProfileId);
  //   } catch (error: any) {
  //     if (
  //       error.response &&
  //       error.response.message === 'Already following this user'
  //     ) {
  //       throw new InternalServerErrorException(
  //         'You are already following this user',
  //       );
  //     }
  //     throw error;
  //   }
  // }
  // // Current user follows a user
  // @Post('me/follow/:followeeProfileId')
  // async meFollowUser(
  //   @Req() req: ReqWithUser,
  //   @Param('followeeProfileId') followeeProfileId: string,
  // ): Promise<ProfileDocument> {
  //   const profileId = req.user.profileId;
  //   if (!profileId) {
  //     throw new InternalServerErrorException('User does not have a profile');
  //   }
  //   try {
  //     return await this.profileService.followUser(profileId, followeeProfileId);
  //   } catch (error: any) {
  //     if (
  //       error.response &&
  //       error.response.message === 'Already following this user'
  //     ) {
  //       throw new InternalServerErrorException(
  //         'You are already following this user',
  //       );
  //     }
  //     throw error;
  //   }
  // }

  // // Unfollow a user
  // @Delete(':profileId/unfollow/:followeeProfileId')
  // async unfollowUser(
  //   @Param('profileId') profileId: string,
  //   @Param('followeeProfileId') followeeProfileId: string,
  // ): Promise<ProfileDocument> {
  //   try {
  //     return await this.profileService.unfollowUser(
  //       profileId,
  //       followeeProfileId,
  //     );
  //   } catch (error: any) {
  //     if (
  //       error.response &&
  //       error.response.message === 'Not following this user'
  //     ) {
  //       throw new InternalServerErrorException(
  //         'You are not following this user',
  //       );
  //     }
  //     throw error;
  //   }
  // }
  // @Delete('me/unfollow/:followeeProfileId')
  // async meUnfollowUser(
  //   @Req() req: ReqWithUser,
  //   @Param('followeeProfileId') followeeProfileId: string,
  // ): Promise<ProfileDocument> {
  //   const profileId = req.user.profileId;
  //   if (!profileId) {
  //     throw new InternalServerErrorException('User does not have a profile');
  //   }
  //   try {
  //     return await this.profileService.unfollowUser(
  //       profileId,
  //       followeeProfileId,
  //     );
  //   } catch (error: any) {
  //     if (
  //       error.response &&
  //       error.response.message === 'Not following this user'
  //     ) {
  //       throw new InternalServerErrorException(
  //         'You are not following this user',
  //       );
  //     }
  //     throw error;
  //   }
  // }

  // // Get followers of a user
  // @Get(':profileId/followers')
  // async getFollowers(
  //   @Param('profileId') profileId: string,
  // ): Promise<ProfileDocument> {
  //   try {
  //     return await this.profileService.getFollowers(profileId);
  //   } catch (error) {
  //     throw new NotFoundException('Profile not found');
  //   }
  // }
  // // Get followers of a user
  // @Get('mine/followers')
  // async getMyFollowers(@Req() req: ReqWithUser): Promise<ProfileDocument> {
  //   const profileId = req.user.profileId;
  //   if (!profileId) {
  //     throw new InternalServerErrorException('User does not have a profile');
  //   }
  //   try {
  //     return await this.profileService.getFollowers(profileId);
  //   } catch (error) {
  //     throw new NotFoundException('Profile not found');
  //   }
  // }

  // // Get following of a user
  // @Get(':profileId/following')
  // async getFollowing(
  //   @Param('profileId') profileId: string,
  // ): Promise<ProfileDocument> {
  //   try {
  //     return await this.profileService.getFollowing(profileId);
  //   } catch (error) {
  //     throw new NotFoundException('Profile not found');
  //   }
  // }
  @Get('')
  @ApiOperation({
    summary: 'List all profiles that the current user is following',
    description:
      'Returns an array of profiles that the current user is following.',
  })
  async getMineFollowing(@Req() req: ReqWithUser): Promise<ProfileInListDto[]> {
    const profileId = req.user.profileId;
    if (!profileId) {
      throw new InternalServerErrorException('User does not have a profile');
    }
    try {
      const profiles = await this.profileService.getFollowing(profileId);
      const parsedProfiles = getProfilesInList(profiles);
      return parsedProfiles;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  @Get(':profileId')
  @ApiOperation({
    summary: 'List all profiles that a user is following',
    description: 'Returns an array of profiles a user is following.',
  })
  async getFollowing(
    @Param('profileId') profileId: string,
  ): Promise<ProfileInListDto[]> {
    if (!profileId) {
      throw new InternalServerErrorException('User does not have a profile');
    }
    try {
      const profiles = await this.profileService.getFollowing(profileId);
      const parsedProfiles = getProfilesInList(profiles);
      return parsedProfiles;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Patch(':followeeProfileId')
  @ApiOperation({
    summary: 'Follow a profile',
    description: 'Follow a profile by providing the profile ID.',
  })
  async followProfile(
    @Req() req: ReqWithUser,
    @Param('followeeProfileId') followeeProfileId: string,
  ): Promise<ProfileDocument['following']> {
    const profileId = req.user.profileId;
    if (!profileId) {
      throw new InternalServerErrorException('User does not have a profile');
    }
    return await this.profileService.followUser(profileId, followeeProfileId);
  }

  @Delete(':followeeProfileId')
  @ApiOperation({
    summary: 'Unfollow a profile',
    description: 'Unfollow a profile by providing the profile ID.',
  })
  async unfollowProfile(
    @Req() req: ReqWithUser,
    @Param('followeeProfileId') followeeProfileId: string,
  ): Promise<ProfileInListDto[]> {
    const profileId = req.user.profileId;
    if (!profileId) {
      throw new InternalServerErrorException('User does not have a profile');
    }
    const profiles = await this.profileService.unfollowUser(
      profileId,
      followeeProfileId,
    );

    const parsedProfiles = getProfilesInList(profiles);
    return parsedProfiles;
  }
}
