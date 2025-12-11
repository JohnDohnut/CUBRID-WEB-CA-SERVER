import { Controller, Get, Logger, Param, Request } from '@nestjs/common';
import { CmsConfigService } from './cms-config.service';
import { GetEnvClientResponse } from '@type';

/**
 * Controller for handling CMS environment configuration operations.
 *
 * Provides REST API endpoints for retrieving environment information
 * from CMS hosts including CUBRID version, broker version, database paths, and system information.
 *
 * CMS 환경 구성 작업을 처리하기 위한 컨트롤러입니다.
 *
 * CUBRID 버전, 브로커 버전, 데이터베이스 경로, 시스템 정보 등
 * CMS 호스트의 환경 정보를 조회하는 REST API 엔드포인트를 제공합니다.
 * - 모든 엔드포인트는 경로 파라미터로 `hostUid`를 받습니다
 * - RESTful 패턴 준수: /:hostUid/cms-config/{action}
 *
 * @category Controllers
 * @since 1.0.0
 */
@Controller(':hostUid/cms-config')
export class CmsConfigController {
    private readonly logger = new Logger(CmsConfigController.name);

    constructor(private readonly cmsConfigService: CmsConfigService) {}

    /**
     * Get environment information from a CMS host.
     * Returns environment variables and system information without CMS envelope fields.
     *
     * CMS 호스트의 환경 정보를 조회합니다.
     * CMS 메타 필드를 제거한 환경 변수 및 시스템 정보를 반환합니다.
     *
     * @route GET /:hostUid/cms-config/env
     * @param req - Express request (contains authenticated user)
     * @param hostUid - Host unique identifier from path parameter
     * @returns GetEnvClientResponse Environment information without CMS envelope fields
     * @example
     * // POST /host-uid/cms-config/env
     */
    @Get('env')
    async getEnv(
        @Request() req,
        @Param('hostUid') hostUid: string
    ): Promise<GetEnvClientResponse> {
        const userId = req.user.sub;

        Logger.log(`Getting environment info for host: ${hostUid}`, 'CmsConfigController');
        const response = await this.cmsConfigService.getEnv(userId, hostUid);
        return response;
    }
}

