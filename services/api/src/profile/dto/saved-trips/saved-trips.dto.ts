import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsString, MaxLength, MinLength } from 'class-validator';
import { TripInListDto, TripInListExample } from 'trip/dto/trip/trip-list.dto';

export class SavedTripDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @ApiProperty({
    description: 'Name of the saved trip folder',
    example: 'Summer Vacations',
  })
  name: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Array of trips in list to be added to the folder',
    example: [TripInListExample],
    type: [TripInListDto],
  })
  trips: TripInListDto[];
}
