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
import { UserRepositoryModule } from './repository/repository.module';
import { UserModule } from '@user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@root/src/token/jwt-auth.guard';
import { TokenModule } from './token/token.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { DatabaseModule } from './database/database.module';
import { BrokerModule } from './broker/broker.module';
import { HostModule } from './host/host.module';
import { LockModule } from './lock/lock.module';

@Module({
  imports: [ConfigModule, SecurityModule, StorageModule, AuthModule,  UserRepositoryModule, UserModule, TokenModule, MonitoringModule, DatabaseModule, BrokerModule, HostModule, LockModule],
  controllers: [AppController],
  providers: [AppService, ConfigService, EncryptionService, StorageService, {provide : APP_GUARD, useClass : JwtAuthGuard}],
})
export class AppModule {}
