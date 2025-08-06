import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { StorageService } from './storage.service';
import { EncryptionModule } from '../encryption/encryption.module';

@Module({    
    imports : [ConfigModule, EncryptionModule],
    exports : [StorageService],
    providers : [StorageService]
})
export class StorageModule {
}
