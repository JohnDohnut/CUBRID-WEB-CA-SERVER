import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UserDTO } from '@type';
import { User, HostInfo, DBInfo } from '@type';

import { EncryptionService } from '@security/encryption/encryption.service';
import { PasswordService } from '@security/password/password.service';
import { StorageService } from '@storage/storage.service';
import { LockService } from '@root/src/lock/lock.service';


import { UserError, UserErrorCode } from '@error';
import { StorageError, StorageErrorCode } from '@error';

@Injectable()
export class UserRepositoryService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly passwordService: PasswordService,
    private readonly storageService: StorageService,
    private readonly lockService: LockService,
  ) { }

  private handleStorageError(err: any, userId?: string): never {
    if (err instanceof StorageError) {
      switch (err.code) {
        case StorageErrorCode.FILE_NOT_FOUND:
          throw UserError.UserNotFound({ userId }, err);
        case StorageErrorCode.FILE_ALREADY_EXISTS:
          throw UserError.UserAlreadyExists({ userId }, err);
        case StorageErrorCode.PERMISSION_DENIED:
        case StorageErrorCode.UNKNOWN:
          throw UserError.Unknown({ userId, storageError: err.code }, err);
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
      this.handleStorageError(err, id);
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
      this.handleStorageError(err, dto.id);
    }
  }

  async deleteUser(id: string): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      await this.storageService.delete(hashedId);
    } catch (err) {
      this.handleStorageError(err, id);
    }
  }

  async updateUser(id: string, userJson: User): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      const encrypted = this.encryptionService.encryptValue(JSON.stringify(userJson));
      await this.storageService.write(hashedId, encrypted);
    } catch (err) {
      this.handleStorageError(err, id);
    }
  }

  async updateUserRaw(id: string, userJson: User): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      const encryted = this.encryptionService.encryptValue(JSON.stringify(userJson));
      await this.storageService.writeRaw(hashedId, encryted);
    } catch (err) {
      this.handleStorageError(err, id);
    }
  }

  async deleteRaw(id: string): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    try {
      await this.storageService.deleteRaw(hashedId);
    } catch (err) {
      this.handleStorageError(err, id);
    }
  }
}
