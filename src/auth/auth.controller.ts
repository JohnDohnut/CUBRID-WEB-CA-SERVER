import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authSerivce: AuthService) { }

    @Post('login')
    login(createUserDTO: CreateUserDTO): { token: string } {
        return { token: "test" };
    }

    @Post('register')
    async register(@Body() createUserDTO: CreateUserDTO)  {
       await this.authSerivce.createUser(createUserDTO);
       return {status : "success"};
    }

    @Delete('delete')
    delete() {

    }

    @Put('update')
    update(){

    }
}
