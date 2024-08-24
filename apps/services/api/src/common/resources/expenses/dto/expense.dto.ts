// attachment.dto.ts
import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Contributor } from 'interfaces/contributor.interface';
import { CommonDto } from '../../../common.dto';

export class ExpenseDto extends PickType(CommonDto, [
  'id',
  'categories',
  'attachments',
] as const) {
  @IsString()
  @MaxLength(200)
  @ApiProperty({
    description:
      'Description of the expense, may include the purpose, the place, and the people involved. Just to label it in a user-friendly way.',
    maximum: 200,
    type: 'string',
    default: 'The payment for the hotel room',
  })
  readonly description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date of the payment.',
    type: 'string',
    format: 'date-time',
    default: '2024-06-01T13:24:15.000Z',
  })
  readonly dateTime: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The currency used for the payment.',
    type: 'string',
    default: 'EUR',
  })
  readonly currency: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'The people involved in the payment.',
    type: 'array',
    isArray: true,
    default: [{ id: '60b3e3c5c9e77c001f8f6b3b', amount: 100 }],
  })
  readonly contributors: Contributor[];

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the attachment was created.',
    type: 'string',
    format: 'date-time',
    default: '2024-06-01T00:00:00.000Z',
  })
  readonly createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the attachment was last updated.',
    type: 'string',
    format: 'date-time',
    default: '2024-06-01T00:00:00.000Z',
  })
  readonly updatedAt: Date;
}
