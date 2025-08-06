import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncryptionModule } from '../encryption/encryption.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
  imports: [EncryptionModule, StorageModule]
})
export class AuthModule {}
