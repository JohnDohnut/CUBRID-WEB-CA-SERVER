import { Injectable, Logger } from '@nestjs/common';
import { CmsHttpsClientService } from '../cms-https-client/cms-https-client.service';
import {
    HostInfo,
    CheckFileCmsRequest,
    LoginCmsRequest,
    LoginCmsResponse,
    User,
} from '@type/index';
import { UserRepositoryService } from '@repository';
import { HostError } from '@error/index';

@Injectable()
export class CmsAuthService {
    constructor(
        //private readonly repository : UserRepositoryService,
        private readonly client: CmsHttpsClientService,
        private readonly repository: UserRepositoryService,
    ) {}
    
    public async login(userId: string, uid: string) {
        const user = await this.repository.loadUserById(userId);
        Logger.log(uid);
        const host: HostInfo = user.host_list[uid];
        if (!host) {
            throw HostError.NoSuchHost({ uid: uid });
        }

        const url = `https://${host.address}:${host.port}/cm_api`;
        const request: LoginCmsRequest = {
            task: 'login',
            host: host.address,
            port: host.port.toString(),
            id: host.id,
            password: host.password,
            clientver: '11.4',
        };

        const response = await this.client.postPublic<
            LoginCmsRequest,
            LoginCmsResponse
        >(url, request);

        // Store token in host info
        host.token = response.token;
        await this.repository.atomicUpdateUser(userId, async (user : User) => {
            user.host_list[uid] = host
            return user;
        } );

        return response.token;
    }

    public async testLogin(host: HostInfo): Promise<string> {
        const url = `https://${host.address}:${host.port}/cm_api`;

        const requestData: LoginCmsRequest = {
            task: 'login',
            host: host.address,
            port: host.port.toString(),
            id: host.id,
            password: host.password,
            clientver: '13.23',
        };

        const response = await this.client.postPublic<
            LoginCmsRequest,
            LoginCmsResponse
        >(url, requestData);

        return response.token;
    }
}
