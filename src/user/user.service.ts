import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository/user-repository/user-repository.service';
import { PasswordService } from '../security/password/password.service';
import { ControllerException } from '../error/controller/controller-exception';
import { ControllerErrorCode } from '../error/controller/controller-error-code';
import { UserMonitoring } from '@type/.';
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

    async getMonitoringPreference(userId : string) : Promise<UserMonitoring>{
        const userJson = await this.repository.loadUserById(userId);
        const rv : UserMonitoring= {
            ha_mon_list : userJson.ha_mon_list,
            resource_mon_list : userJson.resource_mon_list
        }
        return rv;
    }

    async updateMonitoringPreference(userId : string, newMonPref : UserMonitoring) : Promise<UserMonitoring>{

        const userJson = await this.repository.loadUserById(userId);

        userJson.ha_mon_list = newMonPref.ha_mon_list;
        userJson.resource_mon_list = newMonPref.resource_mon_list;

        await this.repository.updateUser(userId, userJson);
        const newUserJson = await this.repository.loadUserById(userId);

        const rv : UserMonitoring = {
            ha_mon_list : newUserJson.ha_mon_list,
            resource_mon_list : newUserJson.resource_mon_list
        }
        return rv;
    }  
        
  
}
