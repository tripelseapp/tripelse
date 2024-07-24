import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ExampleProfileDetailsDto,
  ProfileDetailsDto,
} from './dto/profile-details.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { getProfileDetails } from './utils/getProfileDetails.util';
import { ReqWithUser } from 'auth/types/token-payload.type';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';

@Controller('profile')
@ApiTags('Profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('list')
  @ApiOperation({
    summary: 'List all profiles',
    description: 'Returns an array of all profiles.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [ProfileDetailsDto],
    description: 'Profiles found',
    example: [ExampleProfileDetailsDto],
  })
  async findAllProfiles(): Promise<ProfileDetailsDto[]> {
    const profiles = await this.profileService.findAll();
    return profiles.map(getProfileDetails);
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

    return getProfileDetails(updatedProfile);
  }
}
