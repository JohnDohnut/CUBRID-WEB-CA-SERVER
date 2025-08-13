import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { EncryptionService } from '@security/encryption/encryption.service';
import { SecurityModule } from '@security/security.module';
import { StorageService } from '@storage/storage.service';
import { StorageModule } from '@storage/storage.module';
import { AuthModule } from '@auth/auth.module';
import { PreferenceService } from '@preference/preference.service';
import { PreferenceModule } from '@preference/preference.module';
import { UserRepositoryModule } from './repository/repository.module';
import { UserModule } from '@user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@root/src/token/jwt-auth.guard';
import { TokenModule } from './token/token.module';

@Module({
  imports: [ConfigModule, SecurityModule, StorageModule, AuthModule, PreferenceModule, UserRepositoryModule, UserModule, TokenModule],
  controllers: [AppController],
  providers: [AppService, ConfigService, EncryptionService, StorageService, PreferenceService, {provide : APP_GUARD, useClass : JwtAuthGuard}],
})
export class AppModule {}
