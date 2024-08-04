import { InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  CONNECT_STRING: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_PORT: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  API_PREFIX: string;

  @IsString()
  API_VERSION: string;

  @IsString()
  JWT_EXPIRE: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  GOOGLE_CALLBACK_URL: string;

  @IsEmail()
  GOOGLE_MAIL_USER: string;

  @IsString()
  GOOGLE_APP_PASSWORD: string;

  @IsNumber()
  GOOGLE_MAIL_PORT: number;

  @IsString()
  GOOGLE_MAIL_HOST: string;

  @IsString()
  DOMAIN: string;

  @IsString()
  CLIENT_DOMAIN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new InternalServerErrorException(
      'Your environtment variables are incorrect' + errors[0].toString(),
    );
  }
  return validatedConfig;
}
