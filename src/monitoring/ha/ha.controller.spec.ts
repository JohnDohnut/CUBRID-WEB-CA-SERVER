import { Test, TestingModule } from '@nestjs/testing';
import { HaController } from './ha.controller';

describe('HaController', () => {
  let controller: HaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HaController],
    }).compile();

    controller = module.get<HaController>(HaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
