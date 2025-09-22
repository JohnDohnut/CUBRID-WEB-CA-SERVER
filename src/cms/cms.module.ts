import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { UserRepositoryModule } from '@repository/repository.module';


@Module({
  imports: [UserRepositoryModule],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}