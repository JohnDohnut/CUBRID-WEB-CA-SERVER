import { Test, TestingModule } from '@nestjs/testing';
import { CmsFileController } from './cms-file.controller';

describe('CmsFileController', () => {
  let controller: CmsFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmsFileController],
    }).compile();

    controller = module.get<CmsFileController>(CmsFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
