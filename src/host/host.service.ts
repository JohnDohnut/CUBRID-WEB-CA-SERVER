import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository/user-repository/user-repository.service';
import { HostInfo, User } from '@repository/user-repository/type';
import { GetHostsResponse } from './type/response/get-hosts-response';
import { omitPasswordArray } from '../util';
import { AddHostRequest } from './type/request/add-host-request';
import { AddHostResponse } from './type/response/add-host-response';
import { v4 as uuidv4 } from 'uuid';
import { HostErrorCode, HostException } from '../error/host/host-exception';
@Injectable()
export class HostService {

    constructor(
        private readonly repository : UserRepositoryService,
    ){}

    async getHostList (userId : string) : Promise<GetHostsResponse> {
        const user : User = await this.repository.loadUserById(userId);
        const response : GetHostsResponse = {
            hosts : omitPasswordArray<HostInfo>(user.host_list)
        }
        
        return response

    }

    async addHost (userId : string, hostDTO : AddHostRequest) : Promise<AddHostResponse>{
        const user : User = this.repository.loadUserById(userId);
        if(user.host_list.length > 50){
            throw new HostException(HostErrorCode.MAX_HOSTS);
        }
        const uidv4 = uuidv4();
        const duplicate = user.host_list.find(
            (host) =>
              host.address === hostDTO.address &&
              host.port === hostDTO.port &&
              host.id === hostDTO.id
          );
        
        if(duplicate){
            throw new HostException(HostErrorCode.DUPLICATED_HOST);
        }

        const newHost : HostInfo = {
            ...hostDTO,
            uid : uidv4,
        }

        
    }



}
