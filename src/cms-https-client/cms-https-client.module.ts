import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CmsHttpsClientService } from './cms-https-client.service';

@Module({
    imports: [HttpModule],
    exports: [CmsHttpsClientService],
    providers: [CmsHttpsClientService],
})
export class CmsHttpsClientModule {}
