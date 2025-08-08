import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { StorageService } from './storage.service';
import { SecurityModule } from '../security/security.module';

@Module({    
    imports : [ConfigModule, SecurityModule],
    exports : [StorageService],
    providers : [StorageService]
})
export class StorageModule {
}
