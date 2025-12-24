import { CmsHttpsClientService } from '@cms-https-client/cms-https-client.service';
import { HostService } from '@host';
import { Injectable, Logger } from '@nestjs/common';
import {
    GetBrokerLogListClientResponse,
    GetLogFileInfoCmsResponse as LogFileInfoCmsResponse,
    ViewLogCmsResponse,
    ViewLogClientResponse,
    GetDatabaseLogInfoCmsResponse as LogInfoCmsResponse,
    GetDatabaseLogListClientResponse,
    LoadAccessLogCmsResponse,
    LoadAccessLogClientResponse,
    GetAdminLogInfoCmsResponse,
    GetAdminLogInfoClientResponse,
} from '../type';

@Injectable()
export class LogService {
    constructor(
        private readonly client: CmsHttpsClientService,
        private readonly hostService: HostService,
    ) {}

    async getBrokerLogList(userId: string, hostUid: string, bname: string) {
        const cmsResponse: LogFileInfoCmsResponse =
            await this.client.forwardAuthenticated(userId, {
                hostUid: hostUid,
                task: 'getlogfileinfo',
                broker: bname,
            });
        Logger.debug(cmsResponse);
        const response: GetBrokerLogListClientResponse = {
            broker: cmsResponse.broker,
            logfileinfo: cmsResponse.logfileinfo,
        };
        return response;
    }

    async getDatabaseLogList(userId: string, hostUid: string, dbname: string) {
        const cmsResponse: LogInfoCmsResponse =
            await this.client.forwardAuthenticated(userId, {
                hostUid: hostUid,
                task: 'getloginfo',
                dbname: dbname,
            });

        const response: GetDatabaseLogListClientResponse = {
            dbname: cmsResponse.dbname,
            loginfo: cmsResponse.loginfo,
        };
        return response;
    }

    async getCMSLogList(
        userId: string,
        hostUid: string,
    ): Promise<LoadAccessLogClientResponse> {
        const cmsResponse: LoadAccessLogCmsResponse =
            await this.client.forwardAuthenticated(userId, {
                hostUid: hostUid,
                task: 'loadaccesslog',
            });

        const response: LoadAccessLogClientResponse = {
            accesslog: cmsResponse.accesslog,
            errorlog: cmsResponse.errorlog,
        };
        return response;
    }

    /**
     * View broker log file content.
     * Returns log lines within the specified range.
     *
     * 브로커 로그 파일 내용을 조회합니다.
     * 지정된 범위 내의 로그 라인을 반환합니다.
     *
     * @param userId - User ID from JWT
     * @param hostUid - Host unique identifier
     * @param path - Log file path
     * @param start - Start line number (1-based)
     * @param end - End line number (1-based)
     * @returns ViewLogClientResponse Log file content without CMS envelope fields
     */
    async viewLog(
        userId: string,
        hostUid: string,
        path: string,
        start: string,
        end: string,
    ): Promise<ViewLogClientResponse> {
        const cmsResponse: ViewLogCmsResponse =
            await this.client.forwardAuthenticated(userId, {
                hostUid: hostUid,
                task: 'viewlog',
                path: path,
                start: start,
                end: end,
            });

        // BaseCmsResponse 필드 제외하고 순수 데이터만 반환
        const { __EXEC_TIME, note, status, task, ...dataOnly } = cmsResponse;
        return dataOnly;
    }

    /**
     * Get admin log information from a CMS host.
     * Returns admin log file information without CMS envelope fields.
     *
     * CMS 호스트의 관리자 로그 정보를 조회합니다.
     * CMS 메타 필드를 제거한 관리자 로그 파일 정보를 반환합니다.
     *
     * @param userId - User ID from JWT
     * @param hostUid - Host unique identifier
     * @returns GetAdminLogInfoClientResponse Admin log information without CMS envelope fields
     */
    async getAdminLogInfo(
        userId: string,
        hostUid: string,
    ): Promise<GetAdminLogInfoClientResponse> {
        const cmsResponse: GetAdminLogInfoCmsResponse =
            await this.client.forwardAuthenticated(userId, {
                hostUid: hostUid,
                task: 'getadminloginfo',
            });

        // BaseCmsResponse 필드 제외하고 순수 데이터만 반환
        const { __EXEC_TIME, note, status, task, ...dataOnly } = cmsResponse;
        return dataOnly;
    }
}
