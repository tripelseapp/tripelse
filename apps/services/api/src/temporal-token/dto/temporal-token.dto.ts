// create-temporal-token.dto.ts
import { IsEnum, IsNotEmpty, IsString, IsDate } from 'class-validator';
import {
  TemporalTokenEnum,
  TemporalTokenType,
} from '../types/temporal-token.types';

export class TemporalTokenDto {
  @IsEnum(TemporalTokenEnum)
  @IsNotEmpty()
  type: TemporalTokenType;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
