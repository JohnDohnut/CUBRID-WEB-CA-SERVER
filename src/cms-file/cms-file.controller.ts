import { Body, Controller, Post, Request } from '@nestjs/common';
import { CmsFileService } from './cms-file.service';
import { CheckFileClientRequest, CheckFileClientResponse } from '@type/index';

/**
 * Controller for CMS file operations.
 * CMS 파일 작업을 관리하는 컨트롤러입니다.
 * 
 * Handles HTTP requests for file management including checking file existence,
 * uploading, downloading, and listing files on CMS hosts.
 * 
 * CMS 호스트에서 파일 존재 확인, 업로드, 다운로드, 목록 조회를 포함한
 * 파일 관리를 위한 HTTP 요청을 처리합니다.
 * 
 * @category Controllers
 * @since 1.0.0
 */
@Controller('cms/file')
export class CmsFileController {
    constructor(private readonly cmsFileService: CmsFileService) {}

    /**
     * Check if a file exists on the specified CMS host.
     * 지정된 CMS 호스트에서 파일이 존재하는지 확인합니다.
     * 
     * @param request - Express request object containing user payload
     * @param body - Request body containing hostUid
     * @returns Promise<CheckFileCmsResponse> File check information
     */
    @Post('checkfile')
    async checkFile(
        @Request() request: any,
        @Body() body: CheckFileClientRequest
    ): Promise<CheckFileClientResponse> {
        const userId = request.user.sub;
        return await this.cmsFileService.checkFile(userId, body.hostUid);
    }
}