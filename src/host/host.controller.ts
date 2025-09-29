import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { HostService } from './host.service';
import { HandleHostErrors } from '@common';
import { 
    AddHostRequest, 
    UpdateHostRequest, 
    GetHostsResponse, 
    HostResponse, 
    SafeHostList 
} from '@type/index';

/**
 * Controller for managing host-related operations.
 * 호스트 관련 작업을 관리하는 컨트롤러입니다.
 * 
 * Handles HTTP requests for host management including adding, updating,
 * retrieving, and deleting hosts. All operations require user authentication.
 * 
 * 호스트 추가, 업데이트, 조회, 삭제를 포함한 호스트 관리를 위한 
 * HTTP 요청을 처리합니다. 모든 작업은 사용자 인증이 필요합니다.
 * 
 * @category Controllers
 * @since 1.0.0
 */
@Controller('host')
export class HostController {

    constructor(
        private readonly hostService: HostService,
    ) {}

    /**
     * Add a new host to user's host list.
     * 
     * @param request - Express request object containing user payload
     * @param hostInfo - Host information without UID
     * @returns Promise<void>
     */
    @Post()
    async addHost(@Request() request, @Body() hostInfo: AddHostRequest): Promise<void> {
        const userId = request.user.sub;
        await this.hostService.addHost(userId, hostInfo);
    }

    /**
     * Get all hosts for the authenticated user.
     * 
     * @param request - Express request object containing user payload
     * @returns Promise<GetHostsResponse> List of hosts without passwords
     */
    @Get()
    async getHosts(@Request() request): Promise<GetHostsResponse> {
        const userId = request.user.sub;
        return await this.hostService.getHostList(userId);
    }

    /**
     * Get a specific host by UID.
     * 
     * @param request - Express request object containing user payload
     * @param hostUid - Unique identifier of the host
     * @returns Promise<HostResponse> Host information without password
     */
    @Get(':hostUid')
    async getHost(@Request() request, @Param('hostUid') hostUid: string): Promise<HostResponse> {
        const userId = request.user.sub;
        return await this.hostService.findHost(userId, hostUid);
    }

    /**
     * Update an existing host.
     * 
     * @param request - Express request object containing user payload
     * @param hostUid - Unique identifier of the host to update
     * @param hostInfo - Updated host information without UID
     * @returns Promise<void>
     */
    @Put(':hostUid')
    async updateHost(
        @Request() request, 
        @Param('hostUid') hostUid: string, 
        @Body() hostInfo: UpdateHostRequest
    ): Promise<void> {
        const userId = request.user.sub;
        await this.hostService.updateHost(userId, hostUid, hostInfo);
    }

    /**
     * Delete a host and return updated host list.
     * 
     * @param request - Express request object containing user payload
     * @param hostUid - Unique identifier of the host to delete
     * @returns Promise<SafeHostList> Updated host list without passwords
     */
    @Delete(':hostUid')
    async deleteHost(@Request() request, @Param('hostUid') hostUid: string): Promise<SafeHostList> {
        const userId = request.user.sub;
        return await this.hostService.deleteHost(userId, hostUid);
    }

}
