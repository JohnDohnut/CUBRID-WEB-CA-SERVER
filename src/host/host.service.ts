
import { HostError } from '@error/index';
import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository/user-repository/user-repository.service';
import { EncryptionService } from '@security/encryption/encryption.service';
import { HostInfo } from '@type/host-info';
import { GetHostsResponse } from '@type/response/get-hosts-response';
import { User } from '@type/user';
import { omitPasswordArray } from '@util/omit_password';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HostService {

    constructor(
        private readonly repository: UserRepositoryService,
        private readonly encrytionService: EncryptionService,
    ) { }

    handleError(error: any) {
    }

    async getHostList(userId: string): Promise<GetHostsResponse> {
        const user: User = await this.repository.loadUserById(userId);
        const hostArray = Object.values(user.host_list || {});
        const response: GetHostsResponse = {
            hosts: omitPasswordArray<HostInfo>(hostArray)
        }

        return response

    }

    async addHost(userId:string, hostInfo : Omit<HostInfo, "uid">) : Promise<User>{

        const updatedUser = await this.repository.atomicUpdateUser(userId, async (user : User) => {
            if(Object.keys(user.host_list).length >= 50){
                throw HostError.ExceedMaxHosts({"current host count" : 50 });
            }

            const duplicate = Object.values(user.host_list).find(
                (host) =>
                    host.address === hostInfo.address &&
                    host.port === hostInfo.port &&
                    host.id === hostInfo.id
            );

            if (duplicate) {
                throw HostError.DuplicatedHost({duplicatedHostId : duplicate.uid});
            }

            const newHost: HostInfo = {
                uid: uuidv4(),
                ...hostInfo
            };

            user.host_list[newHost.uid] = newHost;
            return user;
        })
        
        return updatedUser;
    }

    // async addHost(userId: string, hostDTO: AddHostRequest): Promise<HostDTO[]> {

    //     try {

    //         const lock = await this.lockService.acquire(this.encrytionService.getHashedValue(userId));
    //         const user: User = await this.repository.loadUserById(userId);
    //         if (user.host_list.length > 50) {
    //             throw HostError.ExceedMaxHosts();
    //         }
    //         const uidv4 = uuidv4();
    //         const duplicate = user.host_list.find(
    //             (host) =>
    //                 host.address === hostDTO.address &&
    //                 host.port === hostDTO.port &&
    //                 host.id === hostDTO.id
    //         );

    //         if (duplicate) {
    //             throw HostError.DuplicatedHost({duplicatedHost : duplicate.id});
    //         }

    //         const newHost: HostInfo = {
    //             ...hostDTO,
    //             uid: uidv4,
    //         }
            
    //         //TDL : fill the rest of feature using atomic update user 

    //     } catch (error) {
    //         throw HostError.InternalError();
    //     }

    // }

}
