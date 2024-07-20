import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CategoriesEnum } from './enums/category.enum';
import { Expense } from './resources/expenses/entities/expense.entity';
import { Attachment } from './resources/attachments/entity/attachment.entity';

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
  @IsArray()
  @IsString({ each: true })
  @IsIn(Object.values(CategoriesEnum), { each: true })
  @ApiPropertyOptional({
    description: 'The categories of the trip.',
    type: 'string',
    isArray: true,
    default: [CategoriesEnum.ENTERTAINMENT],
  })
  readonly categories: CategoriesEnum[];

  @IsArray()
  @ApiProperty({
    type: Expense,
    isArray: true,
    description: 'Expenses associated with the event.',
  })
  readonly expenses: Expense[];

  //attachments of the event
  @IsArray()
  @ApiPropertyOptional({
    type: Attachment,
    isArray: true,
    description: 'Attachments associated with the event.',
    default: [],
  })
  readonly attachments: Attachment[];
}
