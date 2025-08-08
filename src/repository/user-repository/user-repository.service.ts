import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '@root/src/auth/dto/create-user.dto';
import { EncryptionService } from '@root/src/encryption/encryption.service';
import { ControllerErrorCode } from '@root/src/error/controller/controller-error-code';
import { ControllerException } from '@root/src/error/controller/controller-exception';
import { StorageErrorCode, StorageException } from '@root/src/error/storage/storage-exception';
import { StorageService } from '@root/src/storage/storage.service';
import { User } from '@type/user';

@Injectable()
export class UserRepositoryService {

    constructor(private readonly encryptionService: EncryptionService,
        private readonly storageService: StorageService,
    ) { }

    async loadUserById(id: string): Promise<User> {
        const hashedId = this.encryptionService.getHashedValue(id);
        try {
            const encrypted = await this.storageService.read(hashedId);
            const userJson: User = JSON.parse(this.encryptionService.decryptValue(encrypted))
            return userJson;
        }
        catch (err) {
            if (err instanceof StorageException) {
                const code = err.code;
                switch (code) {
                    case StorageErrorCode.FILE_NOT_FOUND:
                        throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
                    case StorageErrorCode.PERMISSION_DENIED:
                    case StorageErrorCode.UNKNOWN:
                        throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
                }
            }

            throw err;

        }

    }

    async createUser(dto: CreateUserDTO) {
        const hashedId = this.encryptionService.getHashedValue(dto.id);
        try {
            const userJson : User = {
                id : dto.id,
                password : dto.password,
                ha_mon_list : [],
                resource_mon_list : [],
            }

            const filePath = await this.storageService.create(hashedId);
            await this.storageService.write(filePath, JSON.stringify(userJson));

        }
        catch (err) {
            if (err instanceof StorageException) {
                const code = err.code;
                switch (code) {
                    case StorageErrorCode.FILE_ALREADY_EXISTS:
                        throw new ControllerException(ControllerErrorCode.USER_ALREADY_EXISTS);
                    case StorageErrorCode.PERMISSION_DENIED:
                    case StorageErrorCode.UNKNOWN:
                        throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR)
                }
            }
            throw err;
        }
    }

    async deleteUser(id : string){
        const hashedId = this.encryptionService.getHashedValue(id);
        try{
            await this.storageService.delete(hashedId);
        }
        catch(err) {
            if(err instanceof StorageException){
                const code = err.code;
                switch(code) {
                    case StorageErrorCode.FILE_NOT_FOUND:
                        throw new ControllerException(ControllerErrorCode.FORBIDDEN_REQUEST);
                    case StorageErrorCode.PERMISSION_DENIED:
                    case StorageErrorCode.UNKNOWN:
                        throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
                }
            }
            throw err;
        }
    }
    
    async updateUser(id : string, userJson : User){
        const hashedId = this.encryptionService.getHashedValue(id);


    }

}
