import { BaseCmsRequest } from './base-cms-request';

/**
 * Represents a CMS forward request body that does not include the authentication token.
 * This type is used when the client sends a request to the CMS-HTTPS-Client service,
 * and the service is responsible for adding the token before forwarding it to the CMS API.
 *
 * 인증 토큰을 포함하지 않는 CMS 전달 요청 본문을 나타냅니다.
 * 이 타입은 클라이언트가 CMS-HTTPS-Client 서비스로 요청을 보낼 때 사용되며,
 * 서비스는 CMS API로 전달하기 전에 토큰을 추가하는 역할을 합니다.
 *
 * @category Requests
 * @since 1.0.0
 */
export type CmsForwardRequestWithoutToken = Omit<BaseCmsRequest, 'token'>;
