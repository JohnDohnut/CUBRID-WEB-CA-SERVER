import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { JwtStrategy } from './jwt-strategy';
import { UserRepositoryModule } from '../repository/repository.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UserRepositoryModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getSecretKey(),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  exports: [JwtModule, PassportModule],
  providers: [JwtStrategy],
})
export class TokenModule {}
