//import classs validator
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the trip' })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The description of the trip' })
  description: string;
}
