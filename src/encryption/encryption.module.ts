import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { ConfigModule } from '@config/config.module';

@Module({
    imports : [ConfigModule],
    exports : [EncryptionService],
    providers: [EncryptionService]
})
export class EncryptionModule {}
