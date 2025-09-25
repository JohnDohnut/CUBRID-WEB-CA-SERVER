import { Injectable } from '@nestjs/common';
import { CmsClientService } from '../cms-client/cms-client.service';
import { HostInfo } from '../type';
import { CheckFileCmsRequest } from '../type/cms-request/check-file-cms-request';
import { LoginCmsRequest } from '../type/cms-request/login-cms-request';
import { LoginCmsResponse } from '../type/cms-response/login-cms-response';

@Injectable()
export class CmsAuthService {

    constructor(
        //private readonly repository : UserRepositoryService,
        private readonly client : CmsClientService

    ){}


    public async login(host: HostInfo): Promise<string> {
        const url = `https://${host.address}:${host.port}/cm_api`;
        
        const requestData : LoginCmsRequest = {
            task: "login",
            host: host.address,
            port: host.port.toString(),
            id: host.id,
            password: host.password,
            clientver: "13.23"
        };
    
        const response = await this.client.postPublic<LoginCmsRequest, LoginCmsResponse>(url, requestData);
    
        return response.token;
      }
    
      public async checkFile(host: HostInfo, token: string, filePath: string): Promise<void> {
        const url = `https://${host.address}:${host.port}/cm_api`;
        
        const requestData: CheckFileCmsRequest = {
          task: 'check_file',
          path: filePath,
          token: token
        };
        console.log(this.client.postAuthenticated<CheckFileCmsRequest, any>(url, requestData));
        return 
      }
}
