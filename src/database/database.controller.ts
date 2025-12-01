import { ValidationError } from '@error/validation/validation-error';
import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { DatabaseClientRequest as DatabaseInstanceClientRequest, HostUidRequest, StartInfoClientResponse, DatabaseVolumeInfoRequest, DatabaseVolumeInfoClientResponse } from '@type';
import { SaveDatabaseProfileRequest } from '@type/request/sava-database-profile';
import { validateRequiredFields } from '@util';
import { DatabaseService } from './database.service';

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
    private readonly logger = new Logger(DatabaseController.name);

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
        
        validateRequiredFields(body, ['hostUid'], 'database/start-info', this.logger);
        
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
        
        validateRequiredFields(body, ['hostUid', 'dbname'], 'database/start', this.logger);
        
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
        
        validateRequiredFields(body, ['hostUid', 'dbname'], 'database/stop', this.logger);
        
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
        
        validateRequiredFields(body, ['hostUid', 'dbname'], 'database/restart', this.logger);
        
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

        validateRequiredFields(
            body,
            ['hostUid', 'dbname', 'id', 'password'],
            'database/register',
            this.logger,
        );

        return await this.databaseService.saveDatabaseProfile(
            userId,
            body.hostUid,
            body.dbname,
            body.id,
            body.password,
        );
    }

    /**
     * Get database volume/space information for a database on a host.
     * Returns domain-only data (CMS envelope removed).
     *
     * 특정 호스트의 데이터베이스 볼륨/공간 정보를 조회합니다.
     * CMS 메타 필드를 제거한 순수 데이터만 반환합니다.
     *
     * @route POST /database/volume-info
     * @param req Express request (contains authenticated user)
     * @param body DatabaseVolumeInfoRequest — `hostUid`, `dbname`
     * @returns DatabaseVolumeInfoClientResponse 데이터베이스 볼륨/공간 정보
     */
    @Post('volume-info')
    async getDatabaseVolumeInfo(
        @Request() req,
        @Body() body: DatabaseVolumeInfoRequest,
    ): Promise<DatabaseVolumeInfoClientResponse> {
        const userId = req.user.sub;

        validateRequiredFields(
            body,
            ['hostUid', 'dbname'],
            'database/volume-info',
            this.logger,
        );

        Logger.log(
            `Getting volume info for database: ${body.dbname} on host: ${body.hostUid}`,
            'DatabaseController',
        );
        const response = await this.databaseService.getDBSpaceInfo(
            userId,
            body.hostUid,
            body.dbname,
        );
        return response;
    }
}

