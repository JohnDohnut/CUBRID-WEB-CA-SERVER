import { ConfigModule } from '@config/config.module';
import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '@repository/repository.module';
import { SecurityModule } from '@security/security.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
  imports: [SecurityModule, ConfigModule, UserRepositoryModule, JwtModule]
})
export class AuthModule { }
