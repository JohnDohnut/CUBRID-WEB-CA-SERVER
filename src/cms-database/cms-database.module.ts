import { Module } from '@nestjs/common';
import { CmsDatabaseController } from './cms-database.controller';
import { CmsDatabaseService } from './cms-database.service';
import { HostModule } from '@host';
import { CmsHttpsClientModule } from '../cms-https-client/cms-https-client.module';

/**
 * Module for managing CMS database functionalities.
 * Provides database start information and management operations.
 *
 * CMS 데이터베이스 기능을 관리하기 위한 모듈입니다.
 * 데이터베이스 시작 정보 및 관리 작업을 제공합니다.
 *
 * @category Modules
 * @since 1.0.0
 */
@Module({
  controllers: [CmsDatabaseController],
  providers: [CmsDatabaseService],
  imports: [HostModule, CmsHttpsClientModule]
})
export class CmsDatabaseModule {}
