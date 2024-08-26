import { PickType } from '@nestjs/swagger';
import { TemporalTokenDto } from './temporal-token.dto';

export class CreateTemporalTokenDto extends PickType(TemporalTokenDto, [
  'type',
  'token',
  'expiresAt',
  'userId',
] as const) {}

export const CreateTemporalTokenCreate: CreateTemporalTokenDto = {
  type: 'password_reset',
  token: '123456',
  expiresAt: new Date(),
  userId: '123456',
};