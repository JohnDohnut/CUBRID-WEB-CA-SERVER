import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository';
import { HostInfo, User } from '@type/index';
import { HostError } from '@error/index';

/**
 * Service for managing CMS (Content Management System) connections.
 * 
 * Provides functionality for connecting to CMS systems through user hosts.
 * Handles host validation and connection establishment.
 * 
 * @category Business Services
 * @since 1.0.0
 */
@Injectable()
export class CmsService {

    constructor(
        private readonly repository : UserRepositoryService
    ){}

    /**
     * Connects to a CMS system using a specific host.
     * 
     * Validates that the specified host exists in the user's host list
     * and establishes a connection to the CMS system. Currently returns
     * a placeholder response.
     * 
     * @param {string} userId - The unique identifier of the user
     * @param {string} uid - The unique identifier of the host to connect to
     * @returns {Promise<string>} Connection result (currently placeholder)
     * @throws {HostError} When the specified host is not found
     * @throws {UserError} When user is not found
     * @example
     * ```typescript
     * const result = await cmsService.connectCms("user123", "host456");
     * console.log(result); // "asd" (placeholder response)
     * ```
     */
    async connectCms(userId : string, uid : string) : Promise<string>{

        const user : User = await this.repository.loadUserById(userId);
        const targetHost : HostInfo = user.host_list[uid] 
        
        if(!targetHost){
            throw HostError.NoSuchHost();
        }

        // connect to cms 


        return "asd";

    }

}
