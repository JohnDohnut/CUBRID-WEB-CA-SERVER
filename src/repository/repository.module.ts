import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { UserRepositoryService } from './user-repository/user-repository.service';

@Module({
  providers: [RepositoryService, UserRepositoryService]
})
export class RepositoryModule {}
