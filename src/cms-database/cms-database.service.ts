import { HostService } from '@host';
import { Injectable } from '@nestjs/common';
import { CmsHttpsClientService } from '../cms-https-client/cms-https-client.service';
import { BaseCmsRequest, BaseCmsResponse, StartInfoResponse } from '../type';
import { StartDatabaseRequest } from '../type/cms-request/start-database-request';
import { DatabaseError } from '@error/database/database-error';

/**
 * Service for managing CMS database operations.
 *
 * CMS 데이터베이스 작업을 관리하는 서비스입니다.
 *
 * @category Business Services
 * @since 1.0.0
 */
@Injectable()
export class CmsDatabaseService {

    constructor(
        private readonly hostService : HostService,
        private readonly cmsClient : CmsHttpsClientService,
    ){}

    /**
     * Get start information for a database on a specific host.
     * Returns only the actual data without BaseCmsResponse fields.
     *
     * 특정 호스트의 데이터베이스 시작 정보를 조회합니다.
     * BaseCmsResponse 필드 없이 순수 데이터만 반환합니다.
     *
     * @param userId - User ID
     * @param hostUid - Host unique identifier
     * @returns Start information data without BaseCmsResponse fields
     * @throws DatabaseError if the request fails
     */
    async startInfo(userId : string, hostUid : string) : Promise<Omit<StartInfoResponse, keyof BaseCmsResponse>>{
        const host = await this.hostService.findHost(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`;
        const data : BaseCmsRequest = {
            task : "startinfo",
            token : host.token || ""
        };
        const response = await this.cmsClient.postAuthenticated<BaseCmsRequest, StartInfoResponse | BaseCmsResponse>(url, data);
        
        // CMS는 항상 200/201 HTTP status를 반환하므로 body의 status 필드로 성공 여부 판단
        if(response.status === "success"){
            // BaseCmsResponse 필드 제외하고 순수 데이터만 반환
            const { __EXEC_TIME, note, status, task, ...dataOnly } = response as StartInfoResponse;
            return dataOnly;
        }
        
        // status가 "fail"인 경우 에러 던지기
        throw DatabaseError.GetStartInfoFailed({ response });
    }

    /**
     * Start a database on a specific host.
     * 
     * 특정 호스트의 데이터베이스를 시작합니다.
     * 
     * @param userId - User ID
     * @param hostUid - Host unique identifier
     * @param dbname - Database name to start
     * @returns true if successful
     * @throws DatabaseError if the request fails
     */
    async startDatabase(userId: string, hostUid: string, dbname : string) : Promise <boolean> {
        const host = await this.hostService.findHost(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`;
        const data : StartDatabaseRequest = {
            task : "startdb",
            token : host.token || "",
            dbname : dbname,
        };

        const response = await this.cmsClient.postAuthenticated<StartDatabaseRequest, BaseCmsResponse>(url, data);
        
        // CMS는 항상 200/201 HTTP status를 반환하므로 body의 status 필드로 성공 여부 판단
        if (response.status === "success") {
            return true;
        }
        
        throw DatabaseError.StartDatabaseFailed({ response, dbname });
    }
}
