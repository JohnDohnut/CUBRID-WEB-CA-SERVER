import { Module } from '@nestjs/common';
import { SecurityModule } from '../security/security.module';
import { StorageModule } from '../storage/storage.module';
import { UserRepositoryService } from './user-repository/user-repository.service';

@Module({
  providers: [UserRepositoryService],
  imports : [SecurityModule, StorageModule],
  exports : [UserRepositoryService]
})
export class RepositoryModule {}
