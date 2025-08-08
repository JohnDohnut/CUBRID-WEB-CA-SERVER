import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { EncryptionService } from '@encryption/encryption.service';
import { StorageService } from '@storage/storage.service';
import { User, MonitoringHA, MonitoringResource } from '@type/index';
import { ControllerException } from '@root/src/error/controller/controller-exception';
import { ControllerErrorCode } from '@root/src/error/controller/controller-error-code';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly storageService: StorageService,
        private readonly jwtService : JwtService,
    ) { }

    async createUser(createUserDTO: CreateUserDTO) : Promise<void> {

        const user_id = createUserDTO.id;
        const user_password = createUserDTO.password;

        const hashedId = this.encryptionService.getHashedValue(user_id);
        if(this.storageService.getFilePathIfExists(hashedId) !== null){
            throw new ControllerException(ControllerErrorCode.USER_ALREADY_EXISTS);
        }
        
        await this.storageService.create(hashedId);

        const userJson: User = {
            id: user_id,
            password: user_password,
            ha_mon_list: [],
            resource_mon_list: []
        }

        const userJsonText = JSON.stringify(userJson);
        const encrypted = this.encryptionService.encryptValue(userJsonText);

        await this.storageService.write(hashedId, encrypted);

        const readEnc = await this.storageService.read(hashedId);
        const decryptedValue = this.encryptionService.decryptValue(readEnc);
        console.log(decryptedValue);
        
    }

    async validateUser(createUserDTO : CreateUserDTO) : Promise<void> {
        const userId = createUserDTO.id;
        const userPassword = createUserDTO.password;

        const hashedId = this.encryptionService.getHashedValue(userId);

        const userFile = await this.storageService.getFilePathIfExists(hashedId);

        if(userFile === null){
            throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
        }

        const encryptedValue = await this.storageService.read(userFile);
        const decryptedValue = this.encryptionService.decryptValue(encryptedValue);

        const userJson : User = JSON.parse(decryptedValue);

        if (userId !== userJson.id || userPassword !== userJson.password){
            throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
        } 

    }

    async deleteUser
}
