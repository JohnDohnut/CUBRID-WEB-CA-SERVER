import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { CmsAuthService } from './cms-auth.service';
import { HostInfo } from '@type/index';
import { Public } from '@common';

@Controller('cms-auth')
export class CmsAuthController {
    constructor(private readonly cmsAuthService: CmsAuthService) {}

    @Post('login')
    async login(@Request() request: any, uid : string) {
        const userId = request.user.sub;
        this.cmsAuthService.login(userId, uid);
        

    }
    @Public()
    @Post('test-login')
    async testLogin(@Body() body: any) {
        try {
            // Handle field mapping from request body
            const host: HostInfo = {
                address: body.address || body.host || '192.168.2.36',
                port: parseInt(body.port) || 8001,
                id: body.id,
                password: body.password,
                token: body.token || '',
                uid: body.uid || 'test-host',
            };

            const token = await this.cmsAuthService.testLogin(host);
            return {
                success: true,
                token: token,
                message: 'Login successful',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Login failed',
            };
        }
    }
    @Public()
    @Get('test-connection/:hostId')
    async testConnection(@Param('hostId') hostId: string) {
        // Mock host info for testing
        const mockHost: HostInfo = {
            id: 'admin',
            password: '1234',
            token: '',
            address: '192.168.2.36',
            port: 8001,
            uid: hostId,
        };

        try {
            const token = await this.cmsAuthService.testLogin(mockHost);
            return {
                success: true,
                hostId: hostId,
                token: token,
                message: 'Connection test successful',
            };
        } catch (error) {
            return {
                success: false,
                hostId: hostId,
                error: error.message,
                message: 'Connection test failed',
            };
        }
    }
    @Public()
    @Post('validate-token')
    async validateToken(@Body() body: { host: HostInfo; token: string }) {
        try {
            // You can add token validation logic here if needed
            return {
                success: true,
                valid: true,
                message: 'Token is valid',
            };
        } catch (error) {
            return {
                success: false,
                valid: false,
                error: error.message,
                message: 'Token validation failed',
            };
        }
    }
}
