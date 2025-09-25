import { Module } from '@nestjs/common';
import { CmsAuthService } from './cms-auth.service';
import { CmsAuthController } from './cms-auth.controller';
import { CmsClientModule } from '../cms-client/cms-client.module';

@Module({
  imports: [CmsClientModule],
  providers: [CmsAuthService],
  controllers: [CmsAuthController],
  exports: [CmsAuthService]
})
export class CmsAuthModule {}
