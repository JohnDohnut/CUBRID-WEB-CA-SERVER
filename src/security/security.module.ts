import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption/encryption.service';
import { ConfigModule } from '@config/config.module';
import { PasswordService } from './password/password.service';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports : [ConfigModule, PassportModule],
    exports : [EncryptionService, PasswordService],
    providers: [EncryptionService, PasswordService],
})
export class SecurityModule {}
