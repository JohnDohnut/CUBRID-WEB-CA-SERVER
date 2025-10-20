import { Module } from '@nestjs/common';
import { CmsFileService } from './cms-file.service';
import { CmsFileController } from './cms-file.controller';
import { CmsHttpsClientModule } from '../cms-https-client/cms-https-client.module';
import { CmsAuthModule } from '../cms-auth/cms-auth.module';
import { UserRepositoryModule } from '@repository';

@Module({
    imports: [CmsHttpsClientModule, CmsAuthModule, UserRepositoryModule],
    providers: [CmsFileService],
    controllers: [CmsFileController],
    exports: [CmsFileService],
})
export class CmsFileModule {}
