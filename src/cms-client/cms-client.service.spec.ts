import { Test, TestingModule } from '@nestjs/testing';
import { CmsClientService } from './cms-client.service';

describe('CmsClientService', () => {
  let service: CmsClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmsClientService],
    }).compile();

    service = module.get<CmsClientService>(CmsClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
