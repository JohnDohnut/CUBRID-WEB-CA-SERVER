import { Test, TestingModule } from '@nestjs/testing';
import { CmsFileService } from './cms-file.service';

describe('CmsFileService', () => {
    let service: CmsFileService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CmsFileService],
        }).compile();

        service = module.get<CmsFileService>(CmsFileService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});