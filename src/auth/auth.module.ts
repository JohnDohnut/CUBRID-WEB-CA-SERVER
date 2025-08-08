import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncryptionModule } from '../encryption/encryption.module';
import { StorageModule } from '../storage/storage.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
  imports: [ConfigModule, EncryptionModule, StorageModule, JwtModule.registerAsync({
    imports: [ConfigModule], 
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.getSecretKey(), 
      signOptions: { expiresIn: '1h' }, 
      }),
    })
  ]
})
export class AuthModule {}
