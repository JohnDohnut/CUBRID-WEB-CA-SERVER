import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository/user-repository/user-repository.service';
import { HostError } from '@error/host/host-error';
import { HostInfo } from '@type/host-info';

@Injectable()
export class CmsService {

    constructor(
        private readonly repository: UserRepositoryService,
    ) { }

    async connectCms(userId: string, hostUid: string): Promise<HostInfo> {
        const user = await this.repository.loadUserById(userId);

        const host = user.host_list[hostUid];

        if (!host) {
            throw HostError.HostNotFound({ userId, hostUid });
        }

        // Now you have the correct host object.
        // You can proceed to get a token and connect to the CMS.
        console.log('Found host:', host);

        // TDL: Add logic to connect to CMS using this host info

        return host;
    }
}
