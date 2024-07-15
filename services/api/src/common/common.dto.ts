import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier the resource',
    minimum: 24,
    type: 'string',
    default: '123456789012345678901234',
  })
  readonly id: string;
}
