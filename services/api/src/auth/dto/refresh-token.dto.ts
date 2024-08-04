import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString, Matches } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'A JWT token string for refreshing the authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OWUxZjIzMTFlMTViNjcxMDBiY2QwMiIsInVzZXJuYW1lIjoicG9sZ3ViYXUiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcyMTY1NjEwNiwiZXhwIjoxNzIyMjYwOTA2fQ.S1gS-VS1QfY1ZIELjEzQdVvBXC9g1uR-AZnVklm6474',
  })
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
    message: 'Invalid JWT token format',
  })
  readonly refreshToken: string;
}
