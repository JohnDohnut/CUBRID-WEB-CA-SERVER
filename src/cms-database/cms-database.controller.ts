import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { CmsDatabaseService } from './cms-database.service';
import { BaseCmsResponse, CmsForwardRequestWithoutToken, DatabaseRequest, StartInfoResponse } from '../type';

/**
 * Controller for handling CMS database operations.
 * Provides REST API endpoints for database information and management.
 *
 * CMS 데이터베이스 작업을 처리하기 위한 컨트롤러입니다.
 * 데이터베이스 정보 및 관리를 위한 REST API 엔드포인트를 제공합니다.
 *
 * @category Controllers
 * @since 1.0.0
 */
@Controller('cms-database')
export class CmsDatabaseController {

    constructor(private readonly cmsDatabaseService: CmsDatabaseService) {}

    /**
     * Get start information for a database.
     * Returns only the actual data without BaseCmsResponse fields.
     * 
     * 데이터베이스 시작 정보를 조회합니다.
     * BaseCmsResponse 필드 없이 순수 데이터만 반환합니다.
     * 
     * @param req - Request object containing user information
     * @param body - Request body containing hostUid and task
     * @returns Database start information data without BaseCmsResponse fields
     */
    @Post('start-info')
    async getStartInfo(
        @Request() req,
        @Body() body: CmsForwardRequestWithoutToken
    ): Promise<Omit<StartInfoResponse, keyof BaseCmsResponse>> {
        const userId = req.user.sub;
        
        if (!body || !body.hostUid) {
            Logger.error('hostUid is required in request body', 'CmsDatabaseController');
            throw new Error('hostUid is required in request body');
        }
        
        Logger.log(`Getting start info for host: ${body.hostUid}`, 'CmsDatabaseController');
        const response = await this.cmsDatabaseService.startInfo(userId, body.hostUid);
        return response;
    }

    /**
     * Start a database on a specific host.
     * 
     * 특정 호스트의 데이터베이스를 시작합니다.
     * 
     * @param req - Request object containing user information
     * @param body - Request body containing hostUid, dbname
     * @returns true if successful
     */
    @Post('start')
    async startDatabase(
        @Request() req,
        @Body() body: DatabaseRequest
    ): Promise<boolean> {
        const userId = req.user.sub;
        
        if (!body || !body.hostUid || !body.dbname) {
            Logger.error('hostUid and dbname are required in request body', 'CmsDatabaseController');
            throw new Error('hostUid and dbname are required in request body');
        }
        
        Logger.log(`Starting database: ${body.dbname} on host: ${body.hostUid}`, 'CmsDatabaseController');
        const result = await this.cmsDatabaseService.startDatabase(userId, body.hostUid, body.dbname);
        return result;
    }

    /**
     * Stop a database on a specific host.
     * 
     * 특정 호스트의 데이터베이스를 중지합니다.
     * 
     * @param req - Request object containing user information
     * @param body - Request body containing hostUid, dbname
     * @returns true if successful
     */
    @Post('stop')
    async stopDatabase(
        @Request() req,
        @Body() body: DatabaseRequest
    ): Promise<boolean> {
        const userId = req.user.sub;
        
        if (!body || !body.hostUid || !body.dbname) {
            Logger.error('hostUid and dbname are required in request body', 'CmsDatabaseController');
            throw new Error('hostUid and dbname are required in request body');
        }
        
        Logger.log(`Stopping database: ${body.dbname} on host: ${body.hostUid}`, 'CmsDatabaseController');
        const result = await this.cmsDatabaseService.stopDatabase(userId, body.hostUid, body.dbname);
        return result;
    }

    /**
     * Restart a database on a specific host.
     * 
     * 특정 호스트의 데이터베이스를 재시작합니다.
     * 
     * @param req - Request object containing user information
     * @param body - Request body containing hostUid, dbname
     * @returns true if successful
     */
    @Post('restart')
    async restartDatabase(
        @Request() req,
        @Body() body: DatabaseRequest
    ): Promise<boolean> {
        const userId = req.user.sub;
        
        if (!body || !body.hostUid || !body.dbname) {
            Logger.error('hostUid and dbname are required in request body', 'CmsDatabaseController');
            throw new Error('hostUid and dbname are required in request body');
        }
        
        Logger.log(`Restarting database: ${body.dbname} on host: ${body.hostUid}`, 'CmsDatabaseController');
        const result = await this.cmsDatabaseService.restartDatabase(userId, body.hostUid, body.dbname);
        return result;
    }
}
