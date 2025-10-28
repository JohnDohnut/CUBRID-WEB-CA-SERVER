import {
    Body,
    Controller,
    Post,
    Req,
} from '@nestjs/common';
import { CmsHttpsClientService } from './cms-https-client.service';
import { CmsForwardRequestWithoutToken } from '@type/index';

/**
 * Controller for handling CMS HTTPS client requests.
 * This controller acts as a proxy to forward authenticated requests to the CMS API.
 *
 * CMS HTTPS 클라이언트 요청을 처리하기 위한 컨트롤러입니다.
 * 이 컨트롤러는 인증된 요청을 CMS API로 전달하는 프록시 역할을 합니다.
 *
 * @category Controllers
 * @since 1.0.0
 */
@Controller('cms-https-client')
export class CmsHttpsClientController {
    /**
     * @param clientService - The service responsible for forwarding requests to the CMS API.
     *
     * @param clientService - CMS API로 요청을 전달하는 서비스.
     */
    constructor(private readonly clientService: CmsHttpsClientService) {}

    /**
     * Forwards an authenticated request from the client to the CMS API.
     * This endpoint requires JWT authentication. The user's ID is extracted from the JWT,
     * and the host ID is taken from the request body. The request body, which should
     * not contain the token, is then passed to the CmsHttpsClientService for processing.
     *
     * 클라이언트로부터의 인증된 요청을 CMS API로 전달합니다.
     * 이 엔드포인트는 JWT 인증을 필요로 합니다. 사용자 ID는 JWT에서 추출되며,
     * 호스트 ID는 요청 본문에서 가져옵니다. 토큰을 포함하지 않아야 하는 요청 본문은
     * 처리를 위해 CmsHttpsClientService로 전달됩니다.
     *
     * @param req - The Express request object, containing user information from the JWT.
     * @param request - The request body from the client, conforming to CmsForwardRequestWithoutToken.
     * @returns A Promise that resolves with the response from the CMS API.
     *
     * @param req - JWT에서 사용자 정보를 포함하는 Express 요청 객체.
     * @param request - CmsForwardRequestWithoutToken에 따라 클라이언트로부터의 요청 본문 (hostUid 포함).
     * @returns CMS API의 응답으로 해결되는 Promise.
     */
    @Post('forward')
    async forwardRequest(@Req() req, @Body() request: CmsForwardRequestWithoutToken) {
        return this.clientService.forwardAuthenticated(
            req.user.sub,
            request.hostUid,
            request,
        );
    }
}
