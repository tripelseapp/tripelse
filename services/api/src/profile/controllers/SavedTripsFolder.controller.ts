import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqWithUser } from 'auth/types/token-payload.type';
import { CreateSavedTripFolderDto } from 'profile/dto/saved-trips/create-saved-trip-folder.dto';
import { DeleteTripsToFolderDto } from 'profile/dto/saved-trips/deleteTripsToFolder.dto';
import { SavedTripDetailsDto } from 'profile/dto/saved-trips/saved-trips-details.dto';
import { SavedTripDto } from 'profile/dto/saved-trips/saved-trips.dto';
import { getSavedTrips } from 'profile/utils/getSavedTrips.utils';
import {
  ProfileDetailsDto,
  exampleProfileDetailsDto,
} from '../dto/profile-details.dto';
import { ProfileService } from '../services/profile.service';
import { getProfileDetails } from '../utils/getProfileDetails.util';
@Controller('saved-trips')
@ApiTags('Profile / Saved Trips')
export class SavedTripsController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('folder/create')
  @ApiOperation({
    summary: 'Creates a saved trip folder',
    description: 'Creates a saved trip folder for a profile.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProfileDetailsDto,
    description: 'Profile updated',
    example: exampleProfileDetailsDto,
  })
  async createSavedTripFolder(
    @Body() body: CreateSavedTripFolderDto,

    @Req() req: ReqWithUser,
  ): Promise<ProfileDetailsDto> {
    const profileId = req.user.profileId;
    if (!profileId) {
      throw new NotFoundException('Profile not found, please login again');
    }

    const profile = await this.profileService.createSavedTripFolder(
      profileId,
      body.name,
      body.tripIds,
    );
    return getProfileDetails(profile);
  }

  @Delete('folder/:tripId')
  @ApiOperation({
    summary: 'Deletes a saved trip folder',
    description: 'Deletes a saved trip folder for a profile.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProfileDetailsDto,
    description: 'Profile updated',
    example: exampleProfileDetailsDto,
  })
  async deleteSavedTripFolder(@Param('folderId') folderId: string): Promise<{
    message: string;
    id: string;
  }> {
    const profile = await this.profileService.deleteSavedTripFolder(folderId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return { message: 'Folder deleted', id: folderId };
  }

  @Get('folders/mine')
  @ApiOperation({
    summary: 'List saved trip folders',
    description: 'Lists all saved trip folders for the profile.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [SavedTripDto],
    description: 'Profile updated',
    example: exampleProfileDetailsDto.savedTrips,
  })
  async listMineSavedTripFolders(
    @Req() req: ReqWithUser,
  ): Promise<ProfileDetailsDto['savedTrips']> {
    const profileId = req.user.profileId;
    if (!profileId)
      throw new NotFoundException('Profile not found, please login again');

    const profile = await this.profileService.listMySavedTrips(profileId);
    return getProfileDetails(profile).savedTrips || [];
  }

  @Get('folder/:id')
  @ApiOperation({
    summary: 'Get a saved list by its id',
    description: 'Returns a single saved list with a matching id.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: SavedTripDto,
    description: 'Profile updated',
    example: exampleProfileDetailsDto.savedTrips,
  })
  async listSavedTripFolders(
    @Param('id') id: string,
  ): Promise<SavedTripDetailsDto> {
    const folder = await this.profileService.getSavedTripFolder(id);
    return getSavedTrips(folder);
  }

  // remove an array of tripsID from a folder
  @Patch(':folderId/remove')
  @ApiOperation({
    summary: 'Remove a trips reference from a saved folder',
    description: 'Removes multiple (or one) trips from a saved folder.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProfileDetailsDto,
    description: 'Profile updated',
    example: exampleProfileDetailsDto,
  })
  async removeTripFromFolder(
    @Param('folderId') folderId: string,
    @Body() deleteTripsToFolderDto: DeleteTripsToFolderDto,
  ): Promise<SavedTripDetailsDto> {
    const { tripIds } = deleteTripsToFolderDto;
    if (!tripIds || tripIds.length === 0) {
      throw new BadRequestException('No trips to remove');
    }

    const profile = await this.profileService.removeTripFromFolder(
      folderId,
      tripIds,
    );
    return getSavedTrips(profile);
  }

  @Patch(':folderId/add')
  @ApiOperation({
    summary: 'Add trips to a saved folder',
    description: 'Adds multiple (or one) trips to a saved folder.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ProfileDetailsDto,
    description: 'Profile updated',
    example: exampleProfileDetailsDto,
  })
  async addTripToFolder(
    @Param('folderId') folderId: string,
    @Body() deleteTripsToFolderDto: DeleteTripsToFolderDto,
  ): Promise<SavedTripDetailsDto> {
    const { tripIds } = deleteTripsToFolderDto;
    if (!tripIds || tripIds.length === 0) {
      throw new BadRequestException('No trips to add');
    }

    const profile = await this.profileService.addTripToFolder(
      folderId,
      tripIds,
    );
    return getSavedTrips(profile);
  }
}
