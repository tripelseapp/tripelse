// temporal-token.controller.ts
import { Body, Controller, Post, Param, Put, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTemporalTokenDto } from 'temporal-token/dto/create-temporal-token.dto';
import { TemporalTokenDto } from 'temporal-token/dto/temporal-token.dto';
import { UpdateTemporalTokenDto } from 'temporal-token/dto/update-temporal-token.dto';
import { TemporalTokenService } from 'temporal-token/services/temporal-token.service';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';

@Controller('temporal-tokens')
@ApiTags('Temporal Tokens')
export class TemporalTokenController {
  constructor(private readonly temporalTokenService: TemporalTokenService) {}

  @Post()
  async create(
    @Body() createTemporalTokenDto: CreateTemporalTokenDto,
  ): Promise<TemporalTokenDto> {
    const token = await this.temporalTokenService.create(
      createTemporalTokenDto,
    );
    return token;
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTemporalTokenDto: UpdateTemporalTokenDto,
  ): Promise<TemporalTokenDto> {
    const token = await this.temporalTokenService.update(
      id,
      updateTemporalTokenDto,
    );
    return token;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<TemporalTokenDto> {
    const token = await this.temporalTokenService.findOne(id);
    return token;
  }
}
