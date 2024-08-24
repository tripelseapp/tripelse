import { Test, TestingModule } from '@nestjs/testing';
import { TemporalTokenController } from './temporal-token.controller';
import { TemporalTokenService } from '../services/temporal-token.service';

describe('TemporalTokenController', () => {
  let controller: TemporalTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemporalTokenController],
      providers: [TemporalTokenService],
    }).compile();

    controller = module.get<TemporalTokenController>(TemporalTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
