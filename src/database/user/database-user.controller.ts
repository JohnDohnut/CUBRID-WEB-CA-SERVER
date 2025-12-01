import { Body, Controller, Get, Logger, Post, Request } from '@nestjs/common';
import { DatabaseUserService } from './database-user.service';
import { DatabaseLoginClientRequest } from '@type';
import { ValidationError } from '@error/validation/validation-error';
import { validateRequiredFields } from '@util';

/**
 * Controller for managing database users.
 * 
 * 데이터베이스 사용자 관리를 위한 컨트롤러입니다.
 * 
 * @category Controllers
 * @since 1.0.0
 */
@Controller('database/users')
export class DatabaseUserController {
    private readonly logger = new Logger(DatabaseUserController.name);

    constructor(
        private readonly databaseUserService: DatabaseUserService
    ) {}

    /**
     * Get list of database users for a specific host.
     * 
     * 특정 호스트의 데이터베이스 사용자 목록을 조회합니다.
     * 
     * @param req Express request (contains authenticated user)
     * @returns Database users list
     */
    @Get()
    async getDatabaseUsers(@Request() req) {
        const userId = req.user.sub;
        // TODO: Implement
        return await this.databaseUserService.getDatabaseUsers(userId);
    }

    /**
     * Login to a database using profile or client-provided credentials.
     * 
     * 프로파일 또는 클라이언트 제공 자격 증명을 사용하여 데이터베이스에 로그인합니다.
     * 
     * - Profile이 있는 경우: dbname만 필요
     * - Profile이 없는 경우: dbname + id + password 필요
     *
     * @route POST /database/users/login
     * @param req Express request (contains authenticated user)
     * @param body DatabaseLoginClientRequest
     * @returns boolean True on success
     */
    @Post('login')
    async loginDatabase(
        @Request() req,
        @Body() body: DatabaseLoginClientRequest
    ): Promise<boolean> {
        const userId = req.user.sub;
        
        validateRequiredFields(
            body,
            ['hostUid', 'dbname'],
            'database/users/login',
            this.logger,
        );
        
        Logger.log(`Logging in to database: ${body.dbname} on host: ${body.hostUid}`, 'DatabaseUserController');
        const result = await this.databaseUserService.loginDatabase(
            userId,
            body.hostUid,
            body.dbname,
            body.id,
            body.password,
        );
        return result;
    }
}

