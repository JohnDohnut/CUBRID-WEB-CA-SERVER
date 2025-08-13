import { Body, Controller, Delete, Post, Put, Request } from '@nestjs/common';
import { UserDTO } from './dto/request-create-user.dto';
import { AuthService } from './auth.service';
import { LoginResponse, CreateLoginResponse } from '@auth/dto';
import { Public } from '../common/decorators/public.decorator';
@Controller('auth')
export class AuthController {
    constructor(private readonly authSerivce: AuthService) { }

    @Public()
    @Post('login')
    async login(@Body() userDTO: UserDTO): Promise<LoginResponse> {
        const token = await this.authSerivce.login(userDTO);
        return CreateLoginResponse(token);
    }

    @Public()
    @Post('register')
    async register(@Body() userDTO: UserDTO): Promise<void> {
        this.authSerivce.register(userDTO);
    }

    @Post('validate')
    async validate(@Body() reqBody : any, @Request() request ): Promise<boolean>{
        return !!request.user;
    }

}
