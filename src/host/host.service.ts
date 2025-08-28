import { ControllerErrorCode, ControllerException, LockException, StorageException } from '@error/.';
import { Injectable } from '@nestjs/common';
import { HostInfo, User } from '@repository/user-repository/type';
import { UserRepositoryService } from '@repository/user-repository/user-repository.service';
import { omitPasswordArray } from '@util/.';
import { v4 as uuidv4 } from 'uuid';
import { HostErrorCode, HostException } from '../error/host/host-exception';
import { LockService } from '../lock/lock.service';
import { EncryptionService } from '../security/encryption/encryption.service';
import { AddHostRequest } from './type/request/add-host-request';
import { AddHostResponse } from './type/response/add-host-response';
import { GetHostsResponse } from './type/response/get-hosts-response';
import { HostDTO } from './type/dto/host-dto';
@Injectable()
export class HostService {

    constructor(
        private readonly repository: UserRepositoryService,
        private readonly lockService: LockService,
        private readonly encrytionService: EncryptionService,
    ) { }

    handleError(error: any) {
        if (error === typeof (LockException)) {
            switch (error.code) {
                
            }
        }
        else if (error === typeof (StorageException)) {

        }
        else {
            throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
        }
    }

    async getHostList(userId: string): Promise<GetHostsResponse> {
        const user: User = await this.repository.loadUserById(userId);
        const response: GetHostsResponse = {
            hosts: omitPasswordArray<HostInfo>(user.host_list)
        }

        return response

    }

    async addHost(userId: string, hostDTO: AddHostRequest): Promise<HostDTO[]> {

        try {

            const lock = await this.lockService.acquire(this.encrytionService.getHashedValue(userId));
            const user: User = await this.repository.loadUserById(userId);
            if (user.host_list.length > 50) {
                throw new HostException(HostErrorCode.MAX_HOSTS);
            }
            const uidv4 = uuidv4();
            const duplicate = user.host_list.find(
                (host) =>
                    host.address === hostDTO.address &&
                    host.port === hostDTO.port &&
                    host.id === hostDTO.id
            );

            if (duplicate) {
                throw new HostException(HostErrorCode.DUPLICATED_HOST);
            }

            const newHost: HostInfo = {
                ...hostDTO,
                uid: uidv4,
            }

            user.host_list = [...user.host_list, newHost];
            this.repository.updateUserRaw(userId, user);

            this.lockService.release(lock);
            const hosts: HostDTO[] = omitPasswordArray<HostInfo>(user.host_list);
         
            return hosts;

        } catch (error) {
            this.handleError(error);
        }



    }



}
