import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository/user-repository/user-repository.service';
import { PasswordService } from '../security/password/password.service';
import { ControllerException } from '../error/controller/controller-exception';
import { ControllerErrorCode } from '../error/controller/controller-error-code';
import { User } from '@repository/user-repository/type';
import { ChangePasswordRequest } from './request/change-password-request';

@Injectable()
export class UserService {

    constructor(
        private readonly repository : UserRepositoryService,
        private readonly password : PasswordService,

    ){}

    async changePassword(userId : string, dto : ChangePasswordRequest){

        const userJson = await this.repository.loadUserById(userId);
        
        const ok = await this.password.compareHash(dto.oldPassword, userJson.password);
        if(!ok){
            throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
        }

        userJson.password = await this.password.getHashedValue(dto.newPassword);
        
        this.repository.updateUser(userJson.id, userJson);


    }

    async getUserData (userId : string) : Promise<User> {
        const user = await this.repository.loadUserById(userId)
        return user;
    }
  
}
