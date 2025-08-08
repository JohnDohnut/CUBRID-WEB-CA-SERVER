import { Module } from '@nestjs/common';
import { PreferenceController } from './preference.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { PreferenceService } from './preference.service';

@Module({
    imports:[ConfigModule, 
        JwtModule.registerAsync({
            imports: [ConfigModule], 
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.getSecretKey(), 
              signOptions: { expiresIn: '1h' }, 
              }),
            })
    ],
    exports : [PreferenceService],
    providers: [PreferenceService],
    controllers: [PreferenceController]
})
export class PreferenceModule {}
