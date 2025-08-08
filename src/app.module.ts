import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { EncryptionService } from '@root/src/security/encryption/encryption.service';
import { SecurityModule } from '@root/src/security/security.module';
import { StorageService } from '@storage/storage.service';
import { StorageModule } from '@storage/storage.module';
import { AuthModule } from '@auth/auth.module';
import { PreferenceService } from '@preference/preference.service';
import { PreferenceModule } from '@preference/preference.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [ConfigModule, SecurityModule, StorageModule, AuthModule, PreferenceModule, RepositoryModule],
  controllers: [AppController],
  providers: [AppService, ConfigService, EncryptionService, StorageService, PreferenceService],
})
export class AppModule {}
