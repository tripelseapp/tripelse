import { Module } from '@nestjs/common';
import { TemporalTokenService } from './services/temporal-token.service';
import { TemporalTokenController } from './controllers/temporal-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TemporalTokenEntity,
  TemporalTokenSchema,
} from './entities/temporal-token.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TemporalTokenEntity.name, schema: TemporalTokenSchema },
    ]),
  ],
  controllers: [TemporalTokenController],
  providers: [TemporalTokenService],
  exports: [TemporalTokenService],
})
export class TemporalTokenModule {}
