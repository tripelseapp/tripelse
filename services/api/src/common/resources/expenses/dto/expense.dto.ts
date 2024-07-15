// attachment.dto.ts
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { CommonDto } from '../../../common.dto';
import { Contributor } from 'interfaces/contributor.interface';
import { categories, Category } from 'common/enums/category.enum';
import { Attachment } from 'common/resources/attachments/entity/attachment.entity';

export class ExpenseDto extends PickType(CommonDto, ['id'] as const) {
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
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The currency used for the payment.',
    type: 'string',
    default: 'EUR',
  })
  readonly currency: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({
    description: 'The people involved in the payment.',
    type: 'array',
    isArray: true,
    default: ['Alice', 'Bob'],
  })
  readonly contributors: Contributor[];

  @IsString({ each: true })
  @IsIn(categories)
  @ApiPropertyOptional({
    description: 'The category of the event.',
    type: 'string',
    default: 'Food',
  })
  readonly category: Category;

  @IsArray()
  @ApiPropertyOptional({
    type: Attachment,
    isArray: true,
    description: 'Attachments associated with the event.',
    default: [],
  })
  readonly attachments: Attachment[];

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the attachment was created.',
    type: 'string',
    format: 'date-time',
    default: '2024-06-01T00:00:00.000Z',
  })
  readonly createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the attachment was last updated.',
    type: 'string',
    format: 'date-time',
    default: '2024-06-01T00:00:00.000Z',
  })
  readonly updatedAt: string;
}
