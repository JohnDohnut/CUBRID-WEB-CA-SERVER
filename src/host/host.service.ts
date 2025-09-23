
import { HostError } from '@error/index';
import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository';
import { EncryptionService } from '@security';
import { HostInfo } from '@type/host-info';
import { GetHostsResponse } from '@type/response/get-hosts-response';
import { User } from '@type/user';
import { omitPasswordArray } from '@util';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing host-related operations.
 * 
 * Provides business logic for host management including retrieving host lists,
 * adding new hosts, and validating host information. Handles host limits
 * and duplicate detection.
 * 
 * @category Business Services
 * @since 1.0.0
 */
@Injectable()
export class HostService {

    constructor(
        private readonly repository: UserRepositoryService,
        private readonly encrytionService: EncryptionService,
    ) { }

    /**
     * Handles host-related errors.
     * 
     * @param {any} error - The error to handle
     * @private
     */
    handleError(error: any) {
    }

    /**
     * Retrieves the list of hosts for a specific user.
     * 
     * Loads user data and returns all associated hosts with password fields
     * removed for security purposes.
     * 
     * @param {string} userId - The unique identifier of the user
     * @returns {Promise<GetHostsResponse>} Response containing the list of hosts
     * @throws {UserError} When user is not found
     * @example
     * ```typescript
     * const response = await hostService.getHostList("user123");
     * console.log(response.hosts); // Array of HostInfo objects without passwords
     * ```
     */
    async getHostList(userId: string): Promise<GetHostsResponse> {
        const user: User = await this.repository.loadUserById(userId);
        const hostArray = Object.values(user.host_list || {});
        const response: GetHostsResponse = {
            hosts: omitPasswordArray<HostInfo>(hostArray)
        }

        return response

    }

    /**
     * Adds a new host to the user's host list.
     * 
     * Validates host limits (max 50 hosts) and checks for duplicates before
     * adding the new host. Uses atomic update to ensure data consistency.
     * 
     * @param {string} userId - The unique identifier of the user
     * @param {Omit<HostInfo, "uid">} hostInfo - Host information without UID (will be generated)
     * @returns {Promise<User>} The updated user object with the new host
     * @throws {HostError} When host limit is exceeded or duplicate host is found
     * @throws {UserError} When user is not found
     * @example
     * ```typescript
     * const newHost = await hostService.addHost("user123", {
     *   address: "192.168.1.100",
     *   port: 22,
     *   id: "server1",
     *   password: "encrypted_password"
     * });
     * console.log(newHost.host_list); // Contains the new host with generated UID
     * ```
     */
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
