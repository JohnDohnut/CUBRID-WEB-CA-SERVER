import { Test, TestingModule } from '@nestjs/testing';
import { HaService } from './ha.service';

describe('HaService', () => {
  let service: HaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HaService],
    }).compile();

    service = module.get<HaService>(HaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
