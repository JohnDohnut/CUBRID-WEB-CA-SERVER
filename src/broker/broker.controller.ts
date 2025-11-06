import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { BaseCmsResponse, BrokerListClientResponse, BrokerClientRequest, HostUidRequest, GetBrokerStatusClientResponse } from '../type';
import { BrokerService } from './broker.service';
import { ValidationError } from '@error/validation/validation-error';

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
     * @param body - Request body containing hostUid
     * @returns List of brokers
     */
    @Post('list')
    async getBrokers(
        @Request() req,
        @Body() body: HostUidRequest,
    ): Promise<BrokerListClientResponse> {
        const userId = req.user.sub;
        const response = await this.brokerService.getBrokers(userId, body.hostUid);
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
    async stopBroker(@Request() req, @Body() body : BrokerClientRequest) : Promise<BaseCmsResponse>{
        const userId = req.user.sub;
        
        // body 유효성 검사
        if (!body || !body.bname || !body.hostUid) {
            const missingFields: string[] = [];
            if (!body?.hostUid) missingFields.push('hostUid');
            if (!body?.bname) missingFields.push('bname');
            Logger.error(`Missing required fields: ${missingFields.join(', ')}`, 'BrokerController');
            throw ValidationError.MissingRequiredField(missingFields, { endpoint: 'broker/stop' });
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
    async startBroker(@Request() req, @Body() body : BrokerClientRequest) : Promise<BaseCmsResponse>{
        const userId = req.user.sub;
        
        // body 유효성 검사
        if (!body || !body.bname || !body.hostUid) {
            const missingFields: string[] = [];
            if (!body?.hostUid) missingFields.push('hostUid');
            if (!body?.bname) missingFields.push('bname');
            Logger.error(`Missing required fields: ${missingFields.join(', ')}`, 'BrokerController');
            throw ValidationError.MissingRequiredField(missingFields, { endpoint: 'broker/start' });
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
    async restartBroker(@Request() req, @Body() body : BrokerClientRequest) : Promise<boolean>{
        const userId = req.user.sub;
        
        // body 유효성 검사
        if (!body || !body.bname || !body.hostUid) {
            const missingFields: string[] = [];
            if (!body?.hostUid) missingFields.push('hostUid');
            if (!body?.bname) missingFields.push('bname');
            Logger.error(`Missing required fields: ${missingFields.join(', ')}`, 'BrokerController');
            throw ValidationError.MissingRequiredField(missingFields, { endpoint: 'broker/restart' });
        }
        
        Logger.log(`Restarting broker: ${body.bname}`, 'BrokerController');
        const response : boolean = await this.brokerService.restartBroker(userId, body.hostUid, body.bname);
        return response;
    }

    /**
     * Get broker status including application server information.
     * 
     * 애플리케이션 서버 정보를 포함한 브로커 상태를 조회합니다.
     * 
     * @param req - Request object containing user information
     * @param body - Request body containing hostUid and bname
     * @returns Broker status data without BaseCmsResponse fields
     */
    @Post('status')
    async getBrokerStatus(
        @Request() req,
        @Body() body: BrokerClientRequest
    ): Promise<GetBrokerStatusClientResponse> {
        const userId = req.user.sub;
        
        // body 유효성 검사
        if (!body || !body.bname || !body.hostUid) {
            const missingFields: string[] = [];
            if (!body?.hostUid) missingFields.push('hostUid');
            if (!body?.bname) missingFields.push('bname');
            Logger.error(`Missing required fields: ${missingFields.join(', ')}`, 'BrokerController');
            throw ValidationError.MissingRequiredField(missingFields, { endpoint: 'broker/status' });
        }
        
        Logger.log(`Getting broker status: ${body.bname}`, 'BrokerController');
        const response = await this.brokerService.getBrokerStatus(userId, body.hostUid, body.bname);
        return response;
    }
}
