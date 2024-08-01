import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { InvitationService } from './invitation.service';
import { InvitationDto } from './dto/Invitation.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invitation' })
  @ApiResponse({
    status: 201,
    description: 'Invitation created successfully.',
    type: InvitationDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createInvitation(
    @Body() createInvitationDto: CreateInvitationDto,
  ): Promise<InvitationDto> {
    return this.invitationService.create(createInvitationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation updated successfully.',
    type: InvitationDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async updateInvitation(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateInvitationDto: UpdateInvitationDto,
  ): Promise<InvitationDto> {
    return this.invitationService.update(id, updateInvitationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation details retrieved successfully.',
    type: InvitationDto,
  })
  @ApiResponse({ status: 404, description: 'Invitation not found.' })
  async getInvitation(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<InvitationDto> {
    return this.invitationService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Invitation not found.' })
  async deleteInvitation(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<void> {
    return this.invitationService.delete(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all invitations' })
  @ApiResponse({
    status: 200,
    description: 'List of all invitations.',
    type: [InvitationDto],
  })
  async getAllInvitations(): Promise<InvitationDto[]> {
    return this.invitationService.findAll();
  }
}
