import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepositoryModule } from '@repository/repository.module';
import { SecurityModule } from '@security/security.module';
import { UserService } from './user.service';
import { TokenModule } from '../token/token.module';

@Module({
  controllers: [UserController],
  providers : [UserService],
  imports: [UserRepositoryModule, SecurityModule, TokenModule],
  exports: [UserService]
})
export class UserModule {}
