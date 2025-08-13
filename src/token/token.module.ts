import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [],
  imports: [ConfigModule, JwtModule, PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.getSecretKey(),
      signOptions: { expiresIn: '1h' },
    }),
  })],

})
export class TokenModule { }
