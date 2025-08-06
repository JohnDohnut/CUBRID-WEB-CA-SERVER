import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { EncryptionService } from '@encryption/encryption.service';
import { StorageService } from '@storage/storage.service';
import { User, MonitoringHA, MonitoringResource } from '@type/index';
import { CustomException } from '@filter/custom-excpetion';
import { ErrorCode } from '@filter/error-code';

@Injectable()
export class AuthService {

    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly storageService: StorageService,
    ) { }

    async createUser(createUserDTO: CreateUserDTO) : Promise<void> {

        const user_id = createUserDTO.id;
        const user_password = createUserDTO.password;

        const hashedId = this.encryptionService.getHashedValue(user_id);
        if(this.storageService.getFilePathIfExists(hashedId) !== null){
            throw new CustomException(ErrorCode.USER_ALREADY_EXISTS);
        }
        
        await this.storageService.create(hashedId);

        const userJson: User<MonitoringHA, MonitoringResource> = {
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
}
