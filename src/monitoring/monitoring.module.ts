import { Module } from '@nestjs/common';
import { HaController } from './ha/ha.controller';
import { ResourceController } from './resource/resource.controller';
import { HaService } from './ha/ha.service';
import { ResourceService } from './resource/resource.service';

/**
 * Module for managing monitoring functionalities, including HA and resource monitoring.
 *
 * HA 및 리소스 모니터링을 포함한 모니터링 기능을 관리하기 위한 모듈입니다.
 *
 * @category Modules
 * @since 1.0.0
 */
@Module({
    controllers: [HaController, ResourceController],
    providers: [HaService, ResourceService],
})
export class MonitoringModule {}
