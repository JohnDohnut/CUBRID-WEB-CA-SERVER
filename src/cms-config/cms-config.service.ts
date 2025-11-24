import { HostService } from '@host';
import { Injectable } from '@nestjs/common';
import { CmsHttpsClientService } from '@cms-https-client/cms-https-client.service';
import { CmsForwardClientRequest, GetEnvClientResponse } from '@type';
import { GetEnvCmsResponse } from '@type/cms-response/get-env-cms-response';
import { HandleHostErrors, HandleCmsHttpsClientErrors } from '@common';

/**
 * Service for managing CMS environment configuration operations.
 *
 * Provides methods to retrieve environment information from CMS hosts
 * including CUBRID version, broker version, database paths, and system information.
 *
 * CMS 환경 구성 작업을 관리하는 서비스입니다.
 *
 * CUBRID 버전, 브로커 버전, 데이터베이스 경로, 시스템 정보 등
 * CMS 호스트의 환경 정보를 조회하는 메서드를 제공합니다.
 *
 * @category Business Services
 * @since 1.0.0
 */
@Injectable()
export class CmsConfigService {

    constructor(
        private readonly hostService : HostService,
        private readonly cmsClient : CmsHttpsClientService,
    ){}

    /**
     * Get environment information from a CMS host.
     * Returns domain-only data (CMS envelope removed).
     *
     * CMS 호스트의 환경 정보를 조회합니다.
     * CMS 메타 필드를 제거한 순수 데이터만 반환합니다.
     *
     * @param userId - User ID from JWT
     * @param hostUid - Host unique identifier
     * @returns GetEnvClientResponse Environment information without CMS envelope fields
     * @throws Error if the request fails or CMS status is not success
     */
    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    async getEnv(userId: string, hostUid: string): Promise<GetEnvClientResponse> {
        const requestBody: CmsForwardClientRequest = {
            hostUid,
            task: 'getenv',
        };

        const response = await this.cmsClient.forwardAuthenticated<CmsForwardClientRequest, GetEnvCmsResponse>(
            userId,
            requestBody,
        );

        // CMS는 항상 200/201 HTTP status를 반환하므로 body의 status 필드로 성공 여부 판단
        if (response.status === 'success') {
            // BaseCmsResponse 필드 제외하고 순수 데이터만 반환
            const { __EXEC_TIME, note, status, task, ...dataOnly } = response;
            return dataOnly;
        }

        // status가 "fail"인 경우 에러 던지기
        throw new Error(`Failed to get environment info: ${response.note || 'Unknown error'}`);
    }
}

