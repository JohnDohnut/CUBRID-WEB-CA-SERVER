import { Module } from '@nestjs/common';
import { EncryptionModule } from '../encryption/encryption.module';
import { StorageModule } from '../storage/storage.module';
import { UserRepositoryService } from './user-repository/user-repository.service';

@Module({
  providers: [UserRepositoryService],
  imports : [EncryptionModule, StorageModule],
  exports : [UserRepositoryService]
})
export class RepositoryModule {}
