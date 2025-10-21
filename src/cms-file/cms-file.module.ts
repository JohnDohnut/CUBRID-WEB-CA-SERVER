import { Module } from '@nestjs/common';
import { CmsFileService } from './cms-file.service';
import { CmsFileController } from './cms-file.controller';
import { CmsHttpsClientModule } from '../cms-https-client/cms-https-client.module';
import { CmsAuthModule } from '../cms-auth/cms-auth.module';
import { UserRepositoryModule } from '@repository';

/**
 * Module for managing CMS file operations.
 *
 * CMS 파일 작업을 관리하기 위한 모듈입니다.
 *
 * @category Modules
 * @since 1.0.0
 */
@Module({
    imports: [CmsHttpsClientModule, CmsAuthModule, UserRepositoryModule],
    providers: [CmsFileService],
    controllers: [CmsFileController],
    exports: [CmsFileService],
})
export class CmsFileModule {}
