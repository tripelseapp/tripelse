// attachment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier for a attachment.',
    minimum: 24,
    type: 'string',
    default: '',
  })
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({
    description:
      'A filename for the attachment, just to label it in a user-friendly way.',
    maximum: 200,
    type: 'string',
    default: 'summercat',
  })
  readonly filename: string;

  //description
  @IsUrl()
  @MaxLength(500)
  @IsNotEmpty()
  @ApiProperty({
    description: 'URL of the file',
    maximum: 500,
    type: 'string',
    default: 'https://www.google.com',
  })
  readonly url: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({
    description: 'Type/extension of the file',
    maximum: 20,
    type: 'string',
    default: '.jpeg',
  })
  readonly mimetype: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(25000000)
  @ApiProperty({
    description: 'File size in bytes',
    type: 'number',
    default: 17000,
  })
  readonly size: number;
  //is favorite boolean
  @IsBoolean()
  @IsNotEmpty()
  @Max(25000000)
  @ApiProperty({
    description: 'Is the attachment a favorite? True or False',
    type: 'boolean',
    default: '17000',
  })
  readonly isFavorite: boolean;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the attachment was created.',
    type: 'string',
    format: 'date-time',
  })
  readonly createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the attachment was last updated.',
    type: 'string',
    format: 'date-time',
  })
  readonly updatedAt: string;
}
