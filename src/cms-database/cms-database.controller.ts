import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { CmsDatabaseService } from './cms-database.service';
import { BaseCmsResponse, CmsForwardRequestWithoutToken, DatabaseClientRequest, StartInfoClientResponse } from '../type';

/**
 * Controller for handling CMS database operations.
 *
 * - Exposes REST endpoints to query start info and to start/stop/restart a DB
 * - Requires authentication; extracts `userId` from JWT (`req.user.sub`)
 * - All endpoints receive `hostUid` in the request body (not in the path)
 *
 * CMS 데이터베이스 작업을 처리하는 컨트롤러입니다.
 * - 시작 정보 조회 및 DB 시작/중지/재시작 REST 엔드포인트 제공
 * - 인증 필요, JWT의 `req.user.sub`에서 사용자 ID를 추출합니다
 * - 모든 엔드포인트는 경로 파라미터 대신 body로 `hostUid`를 받습니다
 *
 * @category Controllers
 * @since 1.0.0
 */
@Controller('cms-database')
export class CmsDatabaseController {

    constructor(private readonly cmsDatabaseService: CmsDatabaseService) {}

    /**
     * Get start information for databases on a host.
     * Returns only domain data (BaseCmsResponse fields stripped out).
     *
     * 호스트의 데이터베이스 시작 정보를 조회합니다. CMS 메타 필드(BaseCmsResponse)는 제거한 순수 데이터만 반환합니다.
     *
     * @route POST /cms-database/start-info
     * @param req Express request (contains authenticated user)
     * @param body CmsForwardRequestWithoutToken — must include `hostUid`, `task: "startinfo"`
     * @returns StartInfoClientResponse Start info without CMS envelope fields
     * @example
     * // Request body
     * { "hostUid": "host-uid", "task": "startinfo" }
     */
    @Post('start-info')
    async getStartInfo(
        @Request() req,
        @Body() body: CmsForwardRequestWithoutToken
    ): Promise<StartInfoClientResponse> {
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
     * Start a database on a host.
     * 성공 시 true를 반환하고, 실패 시 도메인 에러(DatabaseError)를 던집니다.
     *
     * @route POST /cms-database/start
     * @param req Express request (contains authenticated user)
     * @param body DatabaseClientRequest — `hostUid`, `dbname`
     * @returns boolean True on success
     */
    @Post('start')
    async startDatabase(
        @Request() req,
        @Body() body: DatabaseClientRequest
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
     * Stop a database on a host.
     * 성공 시 true를 반환하고, 실패 시 도메인 에러(DatabaseError)를 던집니다.
     *
     * @route POST /cms-database/stop
     * @param req Express request (contains authenticated user)
     * @param body DatabaseClientRequest — `hostUid`, `dbname`
     * @returns boolean True on success
     */
    @Post('stop')
    async stopDatabase(
        @Request() req,
        @Body() body: DatabaseClientRequest
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
     * Restart a database on a host (stop → start sequence).
     * 성공 시 true를 반환하고, 중지/시작 단계별 실패 시 해당 도메인 에러를 던집니다.
     *
     * @route POST /cms-database/restart
     * @param req Express request (contains authenticated user)
     * @param body DatabaseClientRequest — `hostUid`, `dbname`
     * @returns boolean True on success
     */
    @Post('restart')
    async restartDatabase(
        @Request() req,
        @Body() body: DatabaseClientRequest
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
