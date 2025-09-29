import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CmsClientService } from './cms-client.service';

@Module({
    imports: [HttpModule],
    exports: [CmsClientService],
    providers: [CmsClientService],
})
export class CmsClientModule {}
