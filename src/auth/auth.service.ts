import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryService } from '../repository/user-repository/user-repository.service';
import { UserDTO as UserDTO } from './dto/create-user.dto';
import { User } from '@type/index';
import { ControllerException } from '@error/controller/controller-exception';
import { ControllerErrorCode } from '@root/src/error/controller/controller-error-code';
import { PasswordService } from '@security/password/password.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepositoryService: UserRepositoryService,
        private readonly jwtService: JwtService,
        private readonly passwordService : PasswordService,
    ) { }

    async login(userDTO : UserDTO) : Promise<string>{
        const user : User = await this.userRepositoryService.loadUserById(userDTO.id);
        if(!this.passwordService.compareHash(userDTO.password, user.password)){
            throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
        }
        return this.jwtService.sign(userDTO.id);
    }

    async register(userDTO: UserDTO) {

        this.userRepositoryService.createUser(userDTO);

    }
    

}
