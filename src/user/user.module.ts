import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepositoryModule } from '@repository/repository.module';
import { SecurityModule } from '@security/security.module';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [UserRepositoryModule, SecurityModule],
  exports: [UserService]
})
export class UserModule {}
