import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { SavedTripDto } from './saved-trips.dto';
import { ArrayMinSize, IsString } from 'class-validator';

export class CreateSavedTripFolderDto extends IntersectionType(
  PickType(SavedTripDto, ['name'] as const),
) {
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Array of trips ids to be added to the folder',
    example: ['66b0bc855e33e160ca963d3e'],
    type: [String],
  })
  tripIds: string[];
}

export const createSavedTripFolderExample: CreateSavedTripFolderDto = {
  name: 'Summer Vacation Plans',
  tripIds: ['66b0bc855e33e160ca963d3e'],
};
