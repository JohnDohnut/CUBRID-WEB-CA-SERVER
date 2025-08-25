import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { User } from '@repository/user-repository/type';
import { ChangePasswordRequest } from './request';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService : UserService,
    ){}

    @Get()
    async getUserData(@Request() req) : Promise<User>{
        const payload = req.user;
        return await this.userService.getUserData(payload);
    }

    @Post('credential')
    async changePassword(@Body() dto : ChangePasswordRequest, @Request() req) : Promise<void>{
        const payload = req.user;
        await this.userService.changePassword(payload.sub, dto);

    }

    
    
}
