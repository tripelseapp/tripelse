import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateInvitationDto {
  @ApiProperty({
    description: 'ID of the trip the invitation is associated with',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsNotEmpty()
  readonly tripId: Types.ObjectId;

  @ApiProperty({
    description: 'ID of the user who is sending the invitation',
    example: '60d21b4667d0d8992e610c86',
  })
  @IsNotEmpty()
  readonly inviterId: Types.ObjectId;

  @ApiProperty({
    description: 'Email of the person being invited',
    example: 'invitee@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly inviteeEmail: string;

  @ApiPropertyOptional({
    description: 'Status of the invitation',
    example: 'accepted',
    enum: ['pending', 'accepted', 'declined'],
  })
  @IsOptional()
  @IsIn(['pending', 'accepted', 'declined'])
  status?: string;
}
