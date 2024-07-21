import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ProfileDetailsDto,
  ExampleProfileDetailsDto,
} from './dto/profile-details.dto';

@Controller('profile')
@ApiTags('Profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get profile by user id',
    description: 'Returns a profile associated with the user id.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProfileDetailsDto,
    description: 'Profile found',
    example: ExampleProfileDetailsDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: BadRequestException,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found',
    type: NotFoundException,
  })
  async findOneByUserId(
    @Param('userId') userId: string,
  ): Promise<ProfileDetailsDto> {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid User ID');
    }

    const profile = await this.profileService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }

    return {
      bio: profile.bio,
      avatar: profile.avatar,
      followers: profile.followers.map((id) => id.toString()),
      following: profile.following.map((id) => id.toString()),
      updatedAt: profile.updatedAt,
      userId: profile.userId,
    };
  }

  @Patch('user/:userId')
  @ApiOperation({
    summary: 'Update profile by user id',
    description: 'Updates a profile associated with the user id.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProfileDetailsDto,
    description: 'Profile updated',
    example: ExampleProfileDetailsDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: BadRequestException,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found',
    type: NotFoundException,
  })
  async update(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDetailsDto> {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid User ID');
    }

    const updatedProfile = await this.profileService.update(
      userId,
      updateProfileDto,
    );
    if (!updatedProfile) {
      throw new NotFoundException('Profile not found for this user');
    }

    return {
      bio: updatedProfile.bio,
      avatar: updatedProfile.avatar,
      followers: updatedProfile.followers.map((id) => id.toString()),
      following: updatedProfile.following.map((id) => id.toString()),

      updatedAt: updatedProfile.updatedAt,
      userId: updatedProfile.userId,
    };
  }
}
