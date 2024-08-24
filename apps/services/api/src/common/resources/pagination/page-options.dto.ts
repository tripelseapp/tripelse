import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PossibleOrders } from 'interfaces/pagination.interface';

export class PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    if (!this.page || !this.take) {
      return 0;
    }
    return (this.page - 1) * this.take;
  }

  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Array of fields to order by with their respective order (field:order).',
    type: [String],
    example: ['createdAt:DESC'],
  })
  orderBy?: PossibleOrders | PossibleOrders[];

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Start date for filtering users',
  })
  readonly startDate?: Date;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'End date for filtering users',
  })
  readonly endDate?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Search keyword for fields',
  })
  readonly search?: string;
}
