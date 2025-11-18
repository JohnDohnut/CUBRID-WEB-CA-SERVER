import { HostService } from '@host';
import { Injectable } from '@nestjs/common';
import { CmsHttpsClientService } from '../cms-https-client/cms-https-client.service';
import {
    BaseCmsRequest,
    BaseCmsResponse,
    DBInfo,
    HostInfo,
    StartInfoClientResponse,
} from '../type';
import { StartInfoCmsResponse } from '../type/cms-response/start-info-cms-response';
import {
    StartDatabaseCmsRequest,
    StopDatabaseCmsRequest,
    LoginDBCmsRequest,
} from '../type/cms-request';
import { DatabaseError } from '@error/database/database-error';
import e from 'express';
import { CmsError } from '@error/index';
import { checkCmsTokenError, HandleHostErrors, HandleCmsHttpsClientErrors, HandleDatabaseErrors, HandleUserRepoErrors } from '@common';
import { DBAuthResolver } from '@util/db-auth-resolver';
import { UserRepositoryService } from '@repository';

/**
 * Service for managing CMS database operations.
 *
 * - Builds CMS requests (task, token, payload) and calls CMS HTTPS Client
 * - Evaluates CMS body `status` (HTTP code is always 200/201) to decide success
 * - Strips CMS envelope fields for domain-facing return types when needed
 *
 * CMS 데이터베이스 작업을 관리하는 서비스입니다.
 * - CMS 요청(task, token, payload)을 구성하여 CMS HTTPS Client로 전달합니다
 * - CMS 본문 `status`로 성공/실패를 판단합니다(HTTP 200/201이 항상 반환됨)
 * - 필요 시 도메인에 반환할 때 CMS 메타 필드를 제거합니다
 *
 * @category Business Services
 * @since 1.0.0
 */
@Injectable()
export class CmsDatabaseService {
    constructor(
        private readonly hostService: HostService,
        private readonly cmsClient: CmsHttpsClientService,
        private readonly repository: UserRepositoryService,
    ) {}

    /**
     * Get start information for databases on a host.
     * Returns domain-only data (CMS envelope removed).
     *
     * 특정 호스트의 데이터베이스 시작 정보를 조회합니다.
     * CMS 메타 필드를 제거한 순수 데이터만 반환합니다.
     *
     * @param userId 사용자 ID (JWT)
     * @param hostUid 호스트 UID
     * @returns StartInfoClientResponse
     * @throws DatabaseError 요청 실패 또는 CMS status가 fail인 경우
     */
    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    @HandleDatabaseErrors()
    async startInfo(
        userId: string,
        hostUid: string,
    ): Promise<StartInfoClientResponse> {
        const host = await this.hostService.findHostInternal(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`;
        const data: BaseCmsRequest = {
            task: 'startinfo',
            token: host.token || '',
        };
        const response = await this.cmsClient.postAuthenticated<
            BaseCmsRequest,
            StartInfoCmsResponse | BaseCmsResponse
        >(url, data);

        // CMS token 에러 체크
        checkCmsTokenError(response);

        // CMS는 항상 200/201 HTTP status를 반환하므로 body의 status 필드로 성공 여부 판단
        if (response.status === 'success') {
            // BaseCmsResponse 필드 제외하고 순수 데이터만 반환
            const { __EXEC_TIME: _, note: __, status: ___, task: ____, ...dataOnly } =
                response as StartInfoCmsResponse;
            
            const clientResponse: StartInfoClientResponse = {
                activelist: dataOnly.activelist,
                dblist: {
                    dbs: dataOnly.dblist.dbs.map((db) => ({
                        ...db,
                        isProfileExists: !!host.dbProfiles[db.dbname],
                    })),
                },
            };
            
            return clientResponse;
        } else {
            // status가 "fail"인 경우 에러 던지기
            throw DatabaseError.GetStartInfoFailed({ response });
        }
    }

    /**
     * Start a database on a host.
     *
     * 특정 호스트의 데이터베이스를 시작합니다.
     *
     * @param userId 사용자 ID (JWT)
     * @param hostUid 호스트 UID
     * @param dbname 시작할 DB 이름
     * @returns 성공 시 true
     * @throws DatabaseError CMS status가 fail인 경우
     */
    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    @HandleDatabaseErrors()
    async startDatabase(
        userId: string,
        hostUid: string,
        dbname: string,
    ): Promise<boolean> {
        const host = await this.hostService.findHostInternal(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`;
        const data: StartDatabaseCmsRequest = {
            task: 'startdb',
            token: host.token || '',
            dbname: dbname,
        };

        const response = await this.cmsClient.postAuthenticated<
            StartDatabaseCmsRequest,
            BaseCmsResponse
        >(url, data);

        // CMS token 에러 체크
        checkCmsTokenError(response);

        // CMS는 항상 200/201 HTTP status를 반환하므로 body의 status 필드로 성공 여부 판단
        if (response.status === 'success') {
            return true;
        }

        throw DatabaseError.StartDatabaseFailed({ response, dbname });
    }

    /**
     * Stop a database on a host.
     *
     * 특정 호스트의 데이터베이스를 중지합니다.
     *
     * @param userId 사용자 ID (JWT)
     * @param hostUid 호스트 UID
     * @param dbname 중지할 DB 이름
     * @returns 성공 시 true
     * @throws DatabaseError CMS status가 fail인 경우
     */
    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    @HandleDatabaseErrors()
    async stopDatabase(
        userId: string,
        hostUid: string,
        dbname: string,
    ): Promise<boolean> {
        const host = await this.hostService.findHostInternal(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`;
        const data: StopDatabaseCmsRequest = {
            task: 'stopdb',
            token: host.token || '',
            dbname: dbname,
        };

        const response = await this.cmsClient.postAuthenticated<
            StopDatabaseCmsRequest,
            BaseCmsResponse
        >(url, data);

        // CMS token 에러 체크
        checkCmsTokenError(response);

        // CMS는 항상 200/201 HTTP status를 반환하므로 body의 status 필드로 성공 여부 판단
        if (response.status === 'success') {
            return true;
        }

        throw DatabaseError.StopDatabaseFailed({ response, dbname });
    }

    /**
     * Restart a database (stop then start).
     *
     * 특정 호스트의 데이터베이스를 재시작합니다(중지 후 시작 순차 수행).
     *
     * @param userId 사용자 ID (JWT)
     * @param hostUid 호스트 UID
     * @param dbname 재시작할 DB 이름
     * @returns 성공 시 true
     * @throws DatabaseError 중지/시작 단계에서 실패 시 해당 에러
     */
    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    @HandleDatabaseErrors()
    async restartDatabase(
        userId: string,
        hostUid: string,
        dbname: string,
    ): Promise<boolean> {
        // Stop database
        const host = await this.hostService.findHostInternal(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`;

        const stopRequest: StopDatabaseCmsRequest = {
            task: 'stopdb',
            token: host.token || '',
            dbname: dbname,
        };

        const stopResponse = await this.cmsClient.postAuthenticated<
            StopDatabaseCmsRequest,
            BaseCmsResponse
        >(url, stopRequest);
        
        // CMS token 에러 체크
        checkCmsTokenError(stopResponse);
        
        if (stopResponse.status === 'success') {
            // Start database
            const startRequest: StartDatabaseCmsRequest = {
                task: 'startdb',
                token: host.token || '',
                dbname: dbname,
            };

            const startResponse = await this.cmsClient.postAuthenticated<
                StartDatabaseCmsRequest,
                BaseCmsResponse
            >(url, startRequest);
            
            // CMS token 에러 체크
            checkCmsTokenError(startResponse);
            
            if (startResponse.status === 'success') {
                return true;
            } else {
                throw DatabaseError.StartDatabaseFailed({
                    response: startResponse,
                    dbname,
                });
            }
        } else {
            throw DatabaseError.StopDatabaseFailed({
                response: stopResponse,
                dbname,
            });
        }
    }
    /**
     * Login to a database using profile or client-provided credentials.
     *
     * 프로파일 또는 클라이언트 제공 자격 증명을 사용하여 데이터베이스에 로그인합니다.
     *
     * @param userId 사용자 ID (JWT)
     * @param hostUid 호스트 UID
     * @param dbname 데이터베이스 이름
     * @param clientId 클라이언트 제공 DB 사용자 ID (프로파일이 없는 경우 필수)
     * @param clientPassword 클라이언트 제공 DB 비밀번호 (프로파일이 없는 경우 필수)
     * @returns 성공 시 true
     * @throws DatabaseError CMS status가 fail인 경우 또는 프로파일이 없고 자격 증명이 제공되지 않은 경우
     */
    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    @HandleDatabaseErrors()
    async loginDatabase(
        userId: string,
        hostUid: string,
        dbname: string,
        clientId?: string,
        clientPassword?: string,
    ): Promise<boolean> {
        const host = await this.hostService.findHostInternal(userId, hostUid);
        
        // DB 인증 정보 해결 (프로파일 우선, 없으면 클라이언트 제공 정보 사용)
        const dbAuth = DBAuthResolver.resolve(host, dbname, clientId, clientPassword);
        
        const url = `https://${host.address}:${host.port}/cm_api`;
        const data: LoginDBCmsRequest = {
            task: 'logindb',
            token: host.token || '',
            targetid: host.id,
            dbname: dbAuth.dbname,
            dbuser: dbAuth.id,
            dbpasswd: dbAuth.password,
        };

        const response = await this.cmsClient.postAuthenticated<
            LoginDBCmsRequest,
            BaseCmsResponse
        >(url, data);

        // CMS token 에러 체크
        checkCmsTokenError(response);

        // CMS는 항상 200/201 HTTP status를 반환하므로 body의 status 필드로 성공 여부 판단
        if (response.status === 'success') {
            return true;
        }

        throw DatabaseError.LoginDatabaseFailed({ response, dbname });
    }

    /**
     * Save a database profile for a host.
     *
     * 호스트에 대한 데이터베이스 프로파일을 저장합니다.
     *
     * @param userId 사용자 ID (JWT)
     * @param hostUid 호스트 UID
     * @param dbname 데이터베이스 이름
     * @param databaseId 데이터베이스 사용자 ID
     * @param databasePassword 데이터베이스 비밀번호
     * @returns 성공 시 true
     * @throws DatabaseError 프로파일이 이미 존재하거나 저장 실패 시
     */
    @HandleHostErrors()
    @HandleUserRepoErrors()
    @HandleDatabaseErrors()
    async saveDatabaseProfile(
        userId: string,
        hostUid: string,
        dbname: string,
        databaseId: string,
        databasePassword: string,
    ): Promise<boolean> {
        // 유효성 검증
        if (!dbname || !databaseId || !databasePassword) {
            throw DatabaseError.MissingDBCredentials({
                missingFields: [
                    !dbname && 'dbname',
                    !databaseId && 'id',
                    !databasePassword && 'password',
                ].filter(Boolean) as string[],
            });
        }

        // atomicUpdateUser를 사용하여 저장
        await this.repository.atomicUpdateUser(userId, async (user) => {
            const host = user.host_list[hostUid];
            
            if (!host) {
                throw DatabaseError.HostNotFound({ hostUid });
            }

            // 중복 체크
            if (host.dbProfiles[dbname]) {
                throw DatabaseError.DuplicatedDatabaseProfile({
                    dbname,
                    hostUid,
                });
            }

            // 프로파일 추가
            host.dbProfiles[dbname] = {
                dbname,
                id: databaseId,
                password: databasePassword,
            };

            return user;
        });

        return true;
    }
}
