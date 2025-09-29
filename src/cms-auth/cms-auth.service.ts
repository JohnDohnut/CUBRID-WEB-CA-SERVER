import { Injectable } from '@nestjs/common';
import { CmsClientService } from '../cms-client/cms-client.service';
import { 
    HostInfo,
    CheckFileCmsRequest,
    LoginCmsRequest,
    LoginCmsResponse 
} from '@type/index';
import { UserRepositoryService } from '@repository';
import { HostError } from '@error/index';

@Injectable()
export class CmsAuthService {
    constructor(
        //private readonly repository : UserRepositoryService,
        private readonly client: CmsClientService,
        private readonly repository : UserRepositoryService,
    ) {}

    public async login(userId: string, uid: string){

        const user = await this.repository.loadUserById(userId);
        const host : HostInfo = user.host_list[uid];
        if(!host){
            throw HostError.NoSuchHost({uid : uid});
        }

        const url = `https://${host.address}:${host.port}/cm_api`;
        const request : LoginCmsRequest = {
            task : 'login',
            host: host.address,
            port : host.port.toString(),
            id: host.id,
            password: host.password,
            clientver : '11.4'
        }

        const response = await this.client.postPublic<LoginCmsRequest, LoginCmsResponse>(url, request);

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

    public async checkFile(
        host: HostInfo,
        token: string,
        filePath: string,
    ): Promise<void> {
        const url = `https://${host.address}:${host.port}/cm_api`;

        const requestData: CheckFileCmsRequest = {
            task: 'check_file',
            path: filePath,
            token: token,
        };
        console.log(
            this.client.postAuthenticated<CheckFileCmsRequest, any>(
                url,
                requestData,
            ),
        );
        return;
    }
}
