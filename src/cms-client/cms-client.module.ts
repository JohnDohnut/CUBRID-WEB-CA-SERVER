import { Module } from '@nestjs/common';
import { CmsClientService } from './cms-client.service';

@Module({

    exports : [CmsClientService],
    providers: [CmsClientService],
})
export class CmsClientModule {}
