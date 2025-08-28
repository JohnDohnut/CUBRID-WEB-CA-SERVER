import { Module } from '@nestjs/common';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { UserRepositoryModule } from '../repository/repository.module';
import { SecurityModule } from '../security/security.module';

@Module({
  controllers: [HostController],
  providers: [HostService],
  imports : [UserRepositoryModule, SecurityModule],
  
})
export class HostModule {}
