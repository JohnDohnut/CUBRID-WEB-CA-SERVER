import { Test, TestingModule } from '@nestjs/testing';
import { CmsDatabaseService } from './cms-database.service';

describe('CmsDatabaseService', () => {
  let service: CmsDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmsDatabaseService],
    }).compile();

    service = module.get<CmsDatabaseService>(CmsDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
