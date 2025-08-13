import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption/encryption.service';
import { ConfigModule } from '@config/config.module';
import { PasswordService } from './password/password.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { JwtStrategy } from './jwt/jwt-strategy';

@Module({
    imports : [ConfigModule, PassportModule, JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.getSecretKey(),
          signOptions: { expiresIn: '1h' },
        }),
      }),],
    exports : [EncryptionService, PasswordService, JwtModule, PassportModule],
    providers: [EncryptionService, PasswordService, JwtStrategy],
})
export class SecurityModule {}
