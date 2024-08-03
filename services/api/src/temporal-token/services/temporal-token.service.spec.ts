import { Test, TestingModule } from '@nestjs/testing';
import { TemporalTokenService } from './temporal-token.service';

describe('TemporalTokenService', () => {
  let service: TemporalTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemporalTokenService],
    }).compile();

    service = module.get<TemporalTokenService>(TemporalTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
