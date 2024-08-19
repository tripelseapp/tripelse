import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString, Matches } from 'class-validator';

export class TokensDto {
  @ApiProperty({
    description: 'A JWT token string for accesing the API',
    example: 'eyJhbGciOiJIUzI1NiIsInR',
  })
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
    message: 'Invalid JWT token format',
  })
  readonly accessToken: string;
  @ApiProperty({
    description: 'A JWT token string for refreshing the authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ik',
  })
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
    message: 'Invalid JWT token format',
  })
  readonly refreshToken: string;
}

export const TokensDtoExample: TokensDto = {
  accessToken: 'eyJhbGcasdciOiJIUzI1NiIsInR',
  refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ik',
};
