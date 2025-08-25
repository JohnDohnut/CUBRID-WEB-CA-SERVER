import { Module } from '@nestjs/common';
import { HaController } from './ha/ha.controller';
import { ResourceController } from './resource/resource.controller';
import { HaService } from './ha/ha.service';
import { ResourceService } from './resource/resource.service';

@Module({
  controllers: [HaController, ResourceController],
  providers: [HaService, ResourceService]
})
export class MonitoringModule {}
