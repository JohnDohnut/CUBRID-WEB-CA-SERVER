import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { BaseCmsResponse, BrokerList, BrokerRequest, CmsForwardRequestWithoutToken } from '../type';
import { BrokerService } from './broker.service';

/**
 * Controller for handling broker-related operations.
 * Provides REST API endpoints for broker management operations including:
 * - Get broker list for a specific host
 * - Stop a broker
 * - Start a broker
 * - Restart a broker
 *
 * 브로커 관련 작업을 처리하기 위한 컨트롤러입니다.
 * 브로커의 시작, 중지, 재시작, 목록 조회를 위한 REST API 엔드포인트를 제공합니다.
 *
 * @category Controllers
 * @since 1.0.0
 */
@Controller('broker')
export class BrokerController {

    constructor(private readonly brokerService: BrokerService) {}

    /**
     * Get list of brokers for a specific host.
     * 
     * 특정 호스트의 브로커 목록을 조회합니다.
     * 
     * @param req - Request object containing user information
     * @param Body - Request body containing hostUid
     * @returns List of brokers
     */
    @Post('list')
    async getBrokers(
        @Request() req,
        @Body() Body: CmsForwardRequestWithoutToken,
    ): Promise<BrokerList[]> {
        const userId = req.user.sub;
        const response = await this.brokerService.getBrokers(userId, Body.hostUid);
        return response;
    }

    /**
     * Stop a broker.
     * 
     * 브로커를 중지합니다.
     * 
     * @param req - Request object containing user information
     * @param body - Request body containing hostUid and bname
     * @returns Response indicating success or failure
     */
    @Post('stop')
    async stopBroker(@Request() req, @Body() body : BrokerRequest) : Promise<BaseCmsResponse>{
        const userId = req.user.sub;
        
        // body 유효성 검사
        if (!body || !body.bname || !body.hostUid) {
            Logger.error('bname and hostUid are required in request body', 'BrokerController');
            throw new Error('bname and hostUid are required in request body');
        }
        
        Logger.log(`Stopping broker: ${body.bname}`, 'BrokerController');
        const response = await this.brokerService.stopBroker(userId, body.hostUid, body.bname);
        return response;
    }

    /**
     * Start a broker.
     * 
     * 브로커를 시작합니다.
     * 
     * @param req - Request object containing user information
     * @param body - Request body containing hostUid and bname
     * @returns Response indicating success or failure
     */
    @Post('start')
    async startBroker(@Request() req, @Body() body : BrokerRequest) : Promise<BaseCmsResponse>{
        const userId = req.user.sub;
        
        // body 유효성 검사
        if (!body || !body.bname || !body.hostUid) {
            Logger.error('bname and hostUid are required in request body', 'BrokerController');
            throw new Error('bname and hostUid are required in request body');
        }
        
        Logger.log(`Starting broker: ${body.bname}`, 'BrokerController');
        const response = await this.brokerService.startBroker(userId, body.hostUid, body.bname);
        return response;
    }

    /**
     * Restart a broker.
     * 
     * 브로커를 재시작합니다.
     * 
     * @param req - Request object containing user information
     * @param body - Request body containing hostUid and bname
     * @returns Boolean indicating success
     */
    @Post('restart')
    async restartBroker(@Request() req, @Body() body : BrokerRequest) : Promise<boolean>{
        const userId = req.user.sub;
        
        // body 유효성 검사
        if (!body || !body.bname || !body.hostUid) {
            Logger.error('bname and hostUid are required in request body', 'BrokerController');
            throw new Error('bname and hostUid are required in request body');
        }
        
        Logger.log(`Restarting broker: ${body.bname}`, 'BrokerController');
        const response : boolean = await this.brokerService.restartBroker(userId, body.hostUid, body.bname);
        return response;
    }
}
