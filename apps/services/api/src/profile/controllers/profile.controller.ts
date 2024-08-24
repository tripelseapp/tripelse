import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ProfileDetailsDto,
  exampleProfileDetailsDto,
} from '../dto/profile-details.dto';
import { ProfileService } from '../services/profile.service';
import { getProfileDetails } from '../utils/getProfileDetails.util';

@Controller('profile')
@ApiTags('Profile')
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
    example: [exampleProfileDetailsDto],
  })
  async findAllProfiles(): Promise<ProfileDetailsDto[]> {
    const profiles = await this.profileService.findAll();
    return profiles.map(getProfileDetails);
  }
}
