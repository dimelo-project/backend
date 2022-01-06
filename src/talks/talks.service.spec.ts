import { Test, TestingModule } from '@nestjs/testing';
import { TalksService } from './talks.service';

describe('TalksService', () => {
  let service: TalksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalksService],
    }).compile();

    service = module.get<TalksService>(TalksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
