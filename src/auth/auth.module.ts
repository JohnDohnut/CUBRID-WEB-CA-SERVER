import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '../config/config.service';
import { RepositoryModule } from '../repository/repository.module';
import { SecurityModule } from '../security/security.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
  imports: [SecurityModule, ConfigModule, RepositoryModule , JwtModule.registerAsync({
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
