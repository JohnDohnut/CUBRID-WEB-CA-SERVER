import { Module } from '@nestjs/common';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { UserRepositoryModule } from '../repository/repository.module';

@Module({
  controllers: [HostController],
  providers: [HostService],
  imports : [UserRepositoryModule],
  
})
export class HostModule {}
