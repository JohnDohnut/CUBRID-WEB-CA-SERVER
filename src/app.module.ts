import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { EncryptionService, SecurityModule } from '@security';
import { StorageService, StorageModule } from '@storage';
import { AuthModule } from '@auth';
import { UserRepositoryModule } from '@repository';
import { UserModule } from '@user';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, TokenModule } from '@token';
import { MonitoringModule } from '@monitoring';
import { BrokerModule } from '@broker';
import { HostModule } from '@host';
import { LockModule } from '@lock';
import { CmsModule } from '@cms';

/**
 * Root application module that configures all feature modules and global providers.
 * 
 * This module serves as the main entry point for the WebCA server application,
 * importing all necessary feature modules and configuring global providers
 * including JWT authentication guard.
 * 
 * @module AppModule
 * @since 1.0.0
 */
@Module({
  imports: [ConfigModule, SecurityModule, StorageModule, AuthModule,  UserRepositoryModule, UserModule, TokenModule, MonitoringModule, BrokerModule, HostModule, LockModule, CmsModule],
  controllers: [AppController],
  providers: [AppService, ConfigService, EncryptionService, StorageService, {provide : APP_GUARD, useClass : JwtAuthGuard}],
})
export class AppModule {}

// Export controllers and services for documentation
export { AppController } from './app.controller';
export { AppService } from './app.service';
