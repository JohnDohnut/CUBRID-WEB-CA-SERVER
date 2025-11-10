import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { CmsAuthService } from './cms-auth.service';
import { HostInfo, HostUidRequest } from '@type/index';
import { Public } from '@common';

/**
 * Controller for handling CMS authentication operations.
 *
 * CMS 인증 작업을 처리하기 위한 컨트롤러입니다.
 *
 * @category Controllers
 * @since 1.0.0
 */
@Controller('cms-auth')
export class CmsAuthController {
    constructor(private readonly cmsAuthService: CmsAuthService) {}

    /**
     * Handles CMS login for a specific host.
     *
     * 특정 호스트에 대한 CMS 로그인을 처리합니다.
     *
     * @param request - The Express request object, containing user information from the JWT.
     * @param body - Request body containing the host UID.
     * @returns A boolean indicating successful login.
     */
    @Post('login')
    async login(@Request() request: any, @Body() body: HostUidRequest) {
        const userId = request.user.sub;
        const rv = await this.cmsAuthService.login(userId, body.hostUid) ? true : false
        return rv;
    }
}
