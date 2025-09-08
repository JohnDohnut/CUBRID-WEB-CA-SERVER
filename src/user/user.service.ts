import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository/user-repository/user-repository.service';
import { PasswordService } from '@security/password/password.service';
import { User } from '@type/user';
import { ChangePasswordRequest } from '@type/request/change-password-request';
import { UserError } from '@error/user/user-error';
import { AuthError } from '@error/auth/auth-error';
import { AppError } from '@error/app-error';

@Injectable()
export class UserService {

    constructor(
        private readonly repository : UserRepositoryService,
        private readonly password : PasswordService,

    ){}

    async changePassword(userId : string, dto : ChangePasswordRequest){
        try {
            const userJson = await this.repository.loadUserById(userId);
            if (!userJson) {
                throw UserError.UserNotFound({ userId });
            }
            
            const ok = await this.password.compareHash(dto.oldPassword, userJson.password);
            if(!ok){
                throw AuthError.InvalidCredentials({ userId });
            }
    
            userJson.password = await this.password.getHashedValue(dto.newPassword);
            
            await this.repository.updateUser(userJson.id, userJson);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw UserError.DataUpdateFailed({ userId }, error);
        }
    }

    async getUserData (userId : string) : Promise<User> {
        try {
            const user = await this.repository.loadUserById(userId);
            if (!user) {
                throw UserError.UserNotFound({ userId });
            }
            return user;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw UserError.DataLoadFailed({ userId }, error);
        }
    }
  
}
