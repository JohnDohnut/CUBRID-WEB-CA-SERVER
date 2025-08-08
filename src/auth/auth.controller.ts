import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginResponse, CreateLoginResponse } from './response';
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

    @Delete('delete')
    delete() {

    }

    @Put('update')
    update(){

    }
}
