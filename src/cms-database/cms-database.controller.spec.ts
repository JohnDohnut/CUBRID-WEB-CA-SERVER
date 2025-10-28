import { Test, TestingModule } from '@nestjs/testing';
import { CmsDatabaseController } from './cms-database.controller';

describe('CmsDatabaseController', () => {
  let controller: CmsDatabaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmsDatabaseController],
    }).compile();

    controller = module.get<CmsDatabaseController>(CmsDatabaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
