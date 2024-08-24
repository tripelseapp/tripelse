import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must be no longer than 50 characters' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @ApiProperty({
    description: 'The new password for the user.',
    minimum: 8,
    type: 'string',
    default: 'newPassword1.',
  })
  readonly newPassword: string;

  @IsString()
  @MinLength(10, { message: 'Token must be at least 10 characters long' })
  @MaxLength(100, { message: 'Token must be no longer than 100 characters' })
  @ApiProperty({
    description: 'The token sent to the user to reset the password.',
    minimum: 10,
    type: 'string',
    default: '1568a4c5-4b3e-4b3e-8b3e-4b3e4b3e4b3e',
  })
  readonly token: string;
}

export class ResetPasswordResponseDto {
  @IsString()
  @ApiProperty({
    description: 'A message indicating the result of the password reset',
    minimum: 1,
    type: 'string',
    default: 'Password updated successfully',
  })
  readonly message: string;
}
export const resetPasswordResponseExample = {
  message: 'Password updated successfully',
};
