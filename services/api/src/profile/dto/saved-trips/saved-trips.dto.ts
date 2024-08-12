import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TripInListDto, tripInListExample } from 'trip/dto/trip/trip-list.dto';

export class SavedTripDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier the resource',
    minimum: 24,
    type: 'string',
    default: '123456789012345678901234',
  })
  readonly id: string;
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty({
    description: 'Name of the saved trip folder',
    example: 'Summer Vacations',
  })
  readonly name: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Array of trips in list to be added to the folder',
    example: [tripInListExample],
    type: [TripInListDto],
  })
  readonly trips: TripInListDto[];

  @IsString({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Array of trip IDs in list to be added to the folder',
    example: ['123456789012345678901234'],
    type: [String],
  })
  readonly tripIds: string[];
}
