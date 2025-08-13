import { Injectable } from '@nestjs/common';
import { UserDTO } from '@root/src/auth/dto/request-create-user.dto';
import { EncryptionService } from '@security/encryption/encryption.service';
import { ControllerErrorCode } from '@error/controller/controller-error-code';
import { ControllerException } from '@error/controller/controller-exception';
import { StorageErrorCode, StorageException } from '@root/src/error/storage/storage-exception';
import { StorageService } from '@storage/storage.service';
import { User } from '@type/index';
import { PasswordService } from '@security/password/password.service';

@Injectable()
export class UserRepositoryService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly passwordService: PasswordService,
    private readonly storageService: StorageService,
  ) { }

  async loadUserById(id: string): Promise<User> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {

      const encrypted = await this.storageService.read(hashedId);
      const userJson: User = JSON.parse(this.encryptionService.decryptValue(encrypted));
      return userJson;

    } catch (err) {

      if (err instanceof StorageException) {

        switch (err.code) {
          case StorageErrorCode.FILE_NOT_FOUND:
            throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
          case StorageErrorCode.PERMISSION_DENIED:
          case StorageErrorCode.FILE_LOCKED:
          case StorageErrorCode.UNKNOWN:
            throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
        }

      }
      throw err;
    }
  }

  async createUser(dto: UserDTO) {
    const hashedId = this.encryptionService.getHashedValue(dto.id);
    const userJson: User = {
      id: dto.id,
      password: await this.passwordService.getHashedValue(dto.password),
      ha_mon_list: [],
      resource_mon_list: [],
    };

    try {
      await this.storageService.createAndWrite(hashedId, this.encryptionService.encryptValue(JSON.stringify(userJson)));
    } catch (err) {
      if (err instanceof StorageException) {
        switch (err.code) {
          case StorageErrorCode.FILE_ALREADY_EXISTS:
            throw new ControllerException(ControllerErrorCode.USER_ALREADY_EXISTS);
          case StorageErrorCode.PERMISSION_DENIED:
          case StorageErrorCode.FILE_LOCKED:
          case StorageErrorCode.UNKNOWN:
            throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
        }
      }
      throw err;
    }
  }

  async deleteUser(id: string) {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      await this.storageService.delete(hashedId);
    } catch (err) {
      if (err instanceof StorageException) {
        switch (err.code) {
          case StorageErrorCode.FILE_NOT_FOUND:
            throw new ControllerException(ControllerErrorCode.FORBIDDEN_REQUEST);
          case StorageErrorCode.PERMISSION_DENIED:
          case StorageErrorCode.FILE_LOCKED:
          case StorageErrorCode.UNKNOWN:
            throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
        }
      }
      throw err;
    }
  }

  async updateUser(id: string, userJson: User) {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      await this.storageService.write(hashedId, JSON.stringify(userJson));
    } catch (err) {
      if (err instanceof StorageException) {
        switch (err.code) {
          case StorageErrorCode.FILE_NOT_FOUND:
            throw new ControllerException(ControllerErrorCode.FORBIDDEN_REQUEST);
          case StorageErrorCode.PERMISSION_DENIED:
          case StorageErrorCode.FILE_LOCKED:
          case StorageErrorCode.UNKNOWN:
            throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
        }
      }
      throw err;
    }
  }
}
