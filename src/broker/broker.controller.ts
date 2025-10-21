import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { BaseCmsResponse, BrokerList, CmsForwardRequestWithoutToken } from '../type';
import { BrokerService } from './broker.service';

/**
 * Controller for handling broker-related operations.
 * Currently a placeholder.
 *
 * 브로커 관련 작업을 처리하기 위한 컨트롤러입니다.
 * 현재는 플레이스홀더입니다.
 *
 * @category Controllers
 * @since 1.0.0
 */
@Controller('broker')
export class BrokerController {

    constructor(private readonly brokerService: BrokerService) {}

    @Get(':hostUid')
    async getBrokers(
        @Request() req,
        @Param('hostUid') hostUid,
        @Body() Body: CmsForwardRequestWithoutToken,
    ): Promise<BrokerList[]> {
        const userId = req.user.sub;
        const response = await this.brokerService.getBrokers(userId, hostUid);
        return response;
    }

    @Post('stop/:hostUid')
    async stopBroker(@Request() req, @Param ('hostUid') hostUid, @Body() body : {bname : string}) : Promise<BaseCmsResponse>{
        const userId = req.user.sub;
        const response = await this.brokerService.stopBroker(userId, hostUid, body.bname);
        return response;
    }

    @Post('start/:hostUid')
    async startBroker(@Request() req, @Param ('hostUid') hostUid, @Body() body : {bname : string}) : Promise<BaseCmsResponse>{
        const userId = req.user.sub;
        const response = await this.brokerService.startBroker(userId, hostUid, body.bname);
        return response;
    }

    @Post('restart/:hostUid')
    async restartBroker(@Request() req, @Param ('hostUid') hostUid, @Body() body : {bname : string}) : Promise<boolean>{
        const userId = req.user.sub;
        const response : boolean = await this.brokerService.restartBroker(userId, hostUid, body.bname);
        return response;
    }
}
