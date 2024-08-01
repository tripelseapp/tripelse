import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInvitationDto {
  @ApiPropertyOptional({
    description: 'Status of the invitation',
    example: 'accepted',
    enum: ['pending', 'accepted', 'declined'],
  })
  @IsOptional()
  @IsString()
  status?: string;
}
