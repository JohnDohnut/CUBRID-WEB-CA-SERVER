import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { UserRepositoryModule } from '@repository/repository.module';
import { SecurityModule } from '@security/security.module';
import { TokenModule } from '../token/token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [SecurityModule, ConfigModule, UserRepositoryModule, TokenModule],
  exports: [],
})
export class AuthModule {}
