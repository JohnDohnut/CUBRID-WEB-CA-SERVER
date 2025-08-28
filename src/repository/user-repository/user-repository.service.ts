import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UserDTO } from '@root/src/auth/dto/request-create-user.dto';
import { User } from './type';

import { EncryptionService } from '@security/encryption/encryption.service';
import { PasswordService } from '@security/password/password.service';
import { StorageService } from '@storage/storage.service';
import { FileLock, LockService } from '@root/src/lock/lock.service';

import { StorageException, StorageErrorCode } from '@root/src/error/storage/storage-exception';
import { ControllerException } from '@error/controller/controller-exception';
import { ControllerErrorCode } from '@error/controller/controller-error-code';

@Injectable()
export class UserRepositoryService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly passwordService: PasswordService,
    private readonly storageService: StorageService,
    private readonly lockService: LockService,
  ) { }

  private handleStorageError(err: any): never {
    if (err instanceof StorageException) {
      switch (err.code) {
        case StorageErrorCode.FILE_NOT_FOUND:
          throw new ControllerException(ControllerErrorCode.NO_SUCH_USER);
        case StorageErrorCode.FILE_ALREADY_EXISTS:
          throw new ControllerException(ControllerErrorCode.USER_ALREADY_EXISTS);
          break;
        case StorageErrorCode.PERMISSION_DENIED:
        case StorageErrorCode.FILE_LOCKED:
        case StorageErrorCode.UNKNOWN:
          throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
      }
    }
    throw err;
  }

  async loadUserById(id: string): Promise<User> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      const encrypted = await this.storageService.read(hashedId);
      const userJson: User = JSON.parse(this.encryptionService.decryptValue(encrypted));
      return userJson;
    } catch (err) {
      this.handleStorageError(err);
    }
  }

  async createUser(dto: UserDTO): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(dto.id);
    const uuid = uuidv4();

    const userJson: User = {
      uuid,
      id: dto.id,
      password: await this.passwordService.getHashedValue(dto.password),
      host_list: [],
      ha_mon_list: [],
      resource_mon_list: [],
    };

    try {
      await this.storageService.createAndWrite(hashedId, this.encryptionService.encryptValue(JSON.stringify(userJson)));
    } catch (err) {
      this.handleStorageError(err);
    }
  }

  async deleteUser(id: string): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      await this.storageService.delete(hashedId);
    } catch (err) {
      this.handleStorageError(err);
    }
  }

  async updateUser(id: string, userJson: User): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      const encrypted = this.encryptionService.encryptValue(JSON.stringify(userJson));
      await this.storageService.write(hashedId, encrypted);
    } catch (err) {
      this.handleStorageError(err);
    }
  }

  async updateUserRaw(id: string, userJson: User): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      const encryted = this.encryptionService.encryptValue(JSON.stringify(userJson));
      await this.storageService.writeRaw(hashedId, encryted);
    } catch (err) {
      this.handleStorageError(err);
    }
  }

  async deleteRaw(id: string): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      await this.storageService.deleteRaw(hashedId);
    } catch (err) {
      this.handleStorageError(err);
    }
  }
}
