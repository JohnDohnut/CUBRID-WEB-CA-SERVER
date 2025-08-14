import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordRequest } from './request';
import { UserMonitoring } from '../type';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService : UserService,
    ){}

    @Post('credential')
    async changePassword(@Body() dto : ChangePasswordRequest, @Request() req) {
        const payload = req.user;
        await this.userService.changePassword(payload.sub, dto);

    }

    @Get('mon')
    async getMonitoringPreference(@Request() req) : Promise<UserMonitoring>{
        const payload = req.user;
        const rv = await this.userService.getMonitoringPreference(payload.sub);
        return rv;
    }

    @Put('mon')
    async updateMonitoringPreference(@Body() newMonPref, @Request() req){
        const payload = req.user;
        return await this.userService.updateMonitoringPreference(payload.sub, newMonPref);
    }
    
}
