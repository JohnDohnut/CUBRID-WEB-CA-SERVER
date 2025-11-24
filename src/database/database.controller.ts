import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { BaseCmsResponse, HostUidRequest, DatabaseClientRequest as DatabaseInstanceClientRequest, StartInfoClientResponse } from '@type';
import { ValidationError } from '@error/validation/validation-error';
import { SaveDatabaseProfileRequest } from '@type/request/sava-database-profile';

/**
 * Controller for handling database operations.
 *
 * - Exposes REST endpoints to query start info and to start/stop/restart a DB
 * - Requires authentication; extracts `userId` from JWT (`req.user.sub`)
 * - All endpoints receive `hostUid` in the request body (not in the path)
 *
 * 데이터베이스 작업을 처리하는 컨트롤러입니다.
 * - 시작 정보 조회 및 DB 시작/중지/재시작 REST 엔드포인트 제공
 * - 인증 필요, JWT의 `req.user.sub`에서 사용자 ID를 추출합니다
 * - 모든 엔드포인트는 경로 파라미터 대신 body로 `hostUid`를 받습니다
 *
 * @category Controllers
 * @since 1.0.0
 */
@Controller('database')
export class DatabaseController {

    constructor(private readonly databaseService: DatabaseService) {}

    /**
     * Get start information for databases on a host.
     * Returns only domain data (BaseCmsResponse fields stripped out).
     *
     * 호스트의 데이터베이스 시작 정보를 조회합니다. CMS 메타 필드(BaseCmsResponse)는 제거한 순수 데이터만 반환합니다.
     *
     * @route POST /database/start-info
     * @param req Express request (contains authenticated user)
     * @param body HostUidRequest — must include `hostUid`
     * @returns StartInfoClientResponse Start info without CMS envelope fields
     * @example
     * // Request body
     * { "hostUid": "host-uid" }
     */
    @Post('start-info')
    async getStartInfo(
        @Request() req,
        @Body() body: HostUidRequest
    ): Promise<StartInfoClientResponse> {
        const userId = req.user.sub;
        
        if (!body || !body.hostUid) {
            Logger.error('hostUid is required in request body', 'DatabaseController');
            throw ValidationError.MissingRequiredField('hostUid', { endpoint: 'database/start-info' });
        }
        
        Logger.log(`Getting start info for host: ${body.hostUid}`, 'DatabaseController');
        const response = await this.databaseService.startInfo(userId, body.hostUid);
        return response;
    }

    /**
     * Start a database on a host.
     * 성공 시 최신 시작 정보를 반환하고, 실패 시 도메인 에러(DatabaseError)를 던집니다.
     *
     * @route POST /database/start
     * @param req Express request (contains authenticated user)
     * @param body DatabaseClientRequest — `hostUid`, `dbname`
     * @returns StartInfoClientResponse 최신 데이터베이스 시작 정보
     */
    @Post('start')
    async startDatabase(
        @Request() req,
        @Body() body: DatabaseInstanceClientRequest
    ): Promise<StartInfoClientResponse> {
        const userId = req.user.sub;
        
        if (!body || !body.hostUid || !body.dbname) {
            const missingFields: string[] = [];
            if (!body?.hostUid) missingFields.push('hostUid');
            if (!body?.dbname) missingFields.push('dbname');
            Logger.error(`Missing required fields: ${missingFields.join(', ')}`, 'DatabaseController');
            throw ValidationError.MissingRequiredField(missingFields, { endpoint: 'database/start' });
        }
        
        Logger.log(`Starting database: ${body.dbname} on host: ${body.hostUid}`, 'DatabaseController');
        const result = await this.databaseService.startDatabase(userId, body.hostUid, body.dbname);
        return result;
    }

    /**
     * Stop a database on a host.
     * 성공 시 최신 시작 정보를 반환하고, 실패 시 도메인 에러(DatabaseError)를 던집니다.
     *
     * @route POST /database/stop
     * @param req Express request (contains authenticated user)
     * @param body DatabaseClientRequest — `hostUid`, `dbname`
     * @returns StartInfoClientResponse 최신 데이터베이스 시작 정보
     */
    @Post('stop')
    async stopDatabase(
        @Request() req,
        @Body() body: DatabaseInstanceClientRequest
    ): Promise<StartInfoClientResponse> {
        const userId = req.user.sub;
        
        if (!body || !body.hostUid || !body.dbname) {
            const missingFields: string[] = [];
            if (!body?.hostUid) missingFields.push('hostUid');
            if (!body?.dbname) missingFields.push('dbname');
            Logger.error(`Missing required fields: ${missingFields.join(', ')}`, 'DatabaseController');
            throw ValidationError.MissingRequiredField(missingFields, { endpoint: 'database/stop' });
        }
        
        Logger.log(`Stopping database: ${body.dbname} on host: ${body.hostUid}`, 'DatabaseController');
        const result = await this.databaseService.stopDatabase(userId, body.hostUid, body.dbname);
        return result;
    }

    /**
     * Restart a database on a host (stop → start sequence).
     * 성공 시 최신 시작 정보를 반환하고, 중지/시작 단계별 실패 시 해당 도메인 에러를 던집니다.
     *
     * @route POST /database/restart
     * @param req Express request (contains authenticated user)
     * @param body DatabaseClientRequest — `hostUid`, `dbname`
     * @returns StartInfoClientResponse 최신 데이터베이스 시작 정보
     */
    @Post('restart')
    async restartDatabase(
        @Request() req,
        @Body() body: DatabaseInstanceClientRequest
    ): Promise<StartInfoClientResponse> {
        const userId = req.user.sub;
        
        if (!body || !body.hostUid || !body.dbname) {
            const missingFields: string[] = [];
            if (!body?.hostUid) missingFields.push('hostUid');
            if (!body?.dbname) missingFields.push('dbname');
            Logger.error(`Missing required fields: ${missingFields.join(', ')}`, 'DatabaseController');
            throw ValidationError.MissingRequiredField(missingFields, { endpoint: 'database/restart' });
        }
        
        Logger.log(`Restarting database: ${body.dbname} on host: ${body.hostUid}`, 'DatabaseController');
        const result = await this.databaseService.restartDatabase(userId, body.hostUid, body.dbname);
        return result;
    }


    /**
     * Save a database profile for a host.
     * 성공 시 최신 시작 정보를 반환합니다 (isProfileExists가 업데이트됨).
     *
     * @route POST /database/register
     * @param req Express request (contains authenticated user)
     * @param body SaveDatabaseProfileRequest — `hostUid`, `dbname`, `id`, `password`
     * @returns StartInfoClientResponse 최신 데이터베이스 시작 정보
     */
    @Post('register')
    async saveDatabaseProfile(
        @Request() req,
        @Body() body: SaveDatabaseProfileRequest,
    ): Promise<StartInfoClientResponse> {
        const userId = req.user.sub;

        if (!body || !body.hostUid || !body.dbname) {
            const missingFields: string[] = [];
            if (!body?.hostUid) missingFields.push('hostUid');
            if (!body?.dbname) missingFields.push('dbname');
            if (!body?.id) missingFields.push('id');
            if (body?.password == null) missingFields.push('password');
            if (missingFields.length > 0) {
                Logger.error(
                    `Missing required fields: ${missingFields.join(', ')}`,
                    'DatabaseController',
                );
                throw ValidationError.MissingRequiredField(missingFields, {
                    endpoint: 'database/register',
                });
            }
        }

        return await this.databaseService.saveDatabaseProfile(
            userId,
            body.hostUid,
            body.dbname,
            body.id,
            body.password,
        );
    }
}

