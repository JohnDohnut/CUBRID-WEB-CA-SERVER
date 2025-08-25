import { Module } from '@nestjs/common';
import { SecurityModule } from '../security/security.module';
import { StorageModule } from '../storage/storage.module';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { LockModule } from '../lock/lock.module';

@Module({
  providers: [UserRepositoryService],
  imports : [SecurityModule, StorageModule, LockModule],
  exports : [UserRepositoryService]
})
export class UserRepositoryModule {}
