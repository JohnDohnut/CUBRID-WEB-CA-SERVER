import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginResponse, CreateLoginResponse } from './response';
import { User, WithToken } from '@type/index';
@Controller('auth')
export class AuthController {
    constructor(private readonly authSerivce: AuthService) { }

    @Post('login')
    async login(@Body() userDTO: UserDTO): Promise<LoginResponse> {
        const token = await this.authSerivce.login(userDTO);
        return CreateLoginResponse(token);
    }

    @Post('register')
    async register(@Body() userDTO: UserDTO): Promise<void> {
        this.authSerivce.register(userDTO);
    }

    @Post('validate')
    async validate(@Body() request : WithToken ): Promise<boolean>{
       return !!await this.authSerivce.validateToken(request.token);
       
    }

    @Delete('delete')
    async delete() {
                
    }

    @Put('update')
    update(){

    }
}
