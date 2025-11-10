import { HandleHostErrors } from '@common';
import { HostError } from '@error/index';
import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository';
import { EncryptionService } from '@security';
import {
    HashMap,
    SafeHostList,
    HostInfo,
    User,
    AddHostRequest,
    UpdateHostRequest,
    GetHostsResponse,
    HostResponse,
} from '@type/index';
import { omitPassword, omitPasswordArray, omitPasswordHashMap } from '@util';
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
    ) {}

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
    @HandleHostErrors()
    async getHostList(userId: string): Promise<GetHostsResponse> {
        const user: User = await this.repository.loadUserById(userId);
        const hosts = user.host_list;

        return {
            host_list: omitPasswordHashMap(hosts) as SafeHostList,
        };
    }

    /**
     * Adds a new host to the user's host list.
     *
     * Validates host limits (max 50 hosts) and checks for duplicates before
     * adding the new host. Uses atomic update to ensure data consistency.
     *
     * @param {string} userId - The unique identifier of the user
     * @param {AddHostRequest} hostInfo - Host information without UID (will be generated)
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
    @HandleHostErrors()
    async addHost(userId: string, hostInfo: AddHostRequest): Promise<User> {
        const updatedUser = await this.repository.atomicUpdateUser(
            userId,
            async (user: User) => {
                if (Object.keys(user.host_list).length >= 50) {
                    throw HostError.ExceedMaxHosts({
                        'current host count': 50,
                    });
                }

                const duplicate = Object.values(user.host_list).find(
                    (host) =>
                        host.address === hostInfo.address &&
                        host.port === hostInfo.port &&
                        host.id === hostInfo.id,
                );

                if (duplicate) {
                    throw HostError.DuplicatedHost({
                        duplicatedHostId: duplicate.hostUid,
                    });
                }

                const newHost: HostInfo = {
                    hostUid: uuidv4(),
                    ...hostInfo,
                };

                user.host_list[newHost.hostUid] = newHost;
                return user;
            },
        );

        return updatedUser;
    }

    /**
     * Removes a host from the user's host list.
     *
     * @param {string} userId - The unique identifier of the user.
     * @param {string} hostUid - The unique identifier of the host to be removed.
     * @returns {Promise<User>} The updated user object after removing the host.
     * @throws {HostError.NoSuchHost} If no host with the given UID is found.
     * @throws {UserError} When user is not found.
     */
    @HandleHostErrors()
    async removeHost(userId: string, hostUid: string): Promise<User> {
        const updatedUser = await this.repository.atomicUpdateUser(
            userId,
            async (user: User) => {
                if (!user.host_list[hostUid]) {
                    throw HostError.NoSuchHost({ hostUid });
                }
                delete user.host_list[hostUid];
                return user;
            },
        );
        return updatedUser;
    }

    /**
     * Updates an existing host in the user's host list.
     *
     * @param {string} userId - The unique identifier of the user.
     * @param {string} hostUid - The unique identifier of the host to be updated.
     * @param {UpdateHostRequest} hostInfo - The new host information to apply.
     * @returns {Promise<User>} The updated user object with the modified host.
     * @throws {HostError.NoSuchHost} If no host with the given UID is found.
     * @throws {HostError.NoSuchUser}
     * @throws {UserError} When user is not found.
     */
    @HandleHostErrors()
    async updateHost(
        userId: string,
        hostUid: string,
        hostInfo: UpdateHostRequest,
    ): Promise<User> {
        const updatedUser = await this.repository.atomicUpdateUser(
            userId,
            async (user: User) => {
                if (!user.host_list[hostUid]) {
                    throw HostError.NoSuchHost({ hostUid });
                }

                const updatedHost: HostInfo = {
                    hostUid: hostUid, // Keep the original UID
                    ...hostInfo,
                };

                user.host_list[hostUid] = updatedHost;
                return user;
            },
        );
        return updatedUser;
    }

    /**
     * Finds and returns a single host by its UID.
     *
     * @param {string} userId - The unique identifier of the user.
     * @param {string} hostUid - The unique identifier of the host to find.
     * @returns {Promise<HostInfo>} The found host object.
     * @throws {HostError.NoSuchHost} If no host with the given UID is found.
     * @throws {UserError} When user is not found.
     */
    async findHost(userId: string, hostUid: string): Promise<HostResponse> {
        const user = await this.repository.loadUserById(userId);
        const host = user.host_list[hostUid];

        if (!host) {
            throw HostError.NoSuchHost({ hostUid });
        }

        return omitPassword(host);
    }
    /**
     *
     * @param {string} userId
     * @param {string} hostUid
     * @returns {Promise<SafeHostList>}
     * @throws {HostError.NoSuchHost}
     */
    @HandleHostErrors()
    async deleteHost(userId: string, hostUid: string): Promise<SafeHostList> {
        const updatedUser = await this.repository.atomicUpdateUser(
            userId,
            async (user: User) => {
                if (!user.host_list[hostUid]) {
                    throw HostError.NoSuchHost({ hostUid });
                }
                delete user.host_list[hostUid];
                return user;
            },
        );
        return omitPasswordHashMap(updatedUser.host_list);
    }
}
