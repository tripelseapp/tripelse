import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  InvitationDocument,
  InvitationEntity,
} from './entities/invitation.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationDto } from './dto/Invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(InvitationEntity.name)
    private readonly invitationModel: Model<InvitationEntity>,
  ) {}

  // Create a new invitation
  async create(
    createInvitationDto: CreateInvitationDto,
  ): Promise<InvitationDto> {
    const createdInvitation = new this.invitationModel(createInvitationDto);
    await createdInvitation.save();
    return this.toDto(createdInvitation);
  }

  // Update an existing invitation
  async update(
    id: string,
    updateInvitationDto: UpdateInvitationDto,
  ): Promise<InvitationDto> {
    const invitation = await this.invitationModel.findById(id).exec();
    if (!invitation) {
      throw new NotFoundException(`Invitation with id ${id} not found`);
    }

    Object.assign(invitation, updateInvitationDto);
    await invitation.save();
    return this.toDto(invitation);
  }

  // Get an invitation by ID
  async findById(id: string): Promise<InvitationDto> {
    const invitation = await this.invitationModel.findById(id).exec();
    if (!invitation) {
      throw new NotFoundException(`Invitation with id ${id} not found`);
    }
    return this.toDto(invitation);
  }

  // Delete an invitation by ID
  async delete(id: string): Promise<void> {
    const result = await this.invitationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Invitation with id ${id} not found`);
    }
  }

  // List all invitations
  async findAll(): Promise<InvitationDto[]> {
    const invitations = await this.invitationModel.find().exec();
    return invitations.map(this.toDto);
  }

  // Convert database model to DTO
  private toDto(invitation: InvitationDocument): InvitationDto {
    return {
      tripId: new Types.ObjectId(invitation.tripId),
      inviterId: new Types.ObjectId(invitation.inviterId),
      inviteeEmail: invitation.inviteeEmail,
      status: invitation.status,
      invitationDate: invitation.invitationDate,
    };
  }
}
