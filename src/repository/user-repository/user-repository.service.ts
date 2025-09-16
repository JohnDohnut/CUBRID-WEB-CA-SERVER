import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UserDTO } from '@type/dto/user.dto';
import { User } from '@type/user';

import { LockService } from '@lock/lock.service';
import { EncryptionService } from '@security/encryption/encryption.service';
import { PasswordService } from '@security/password/password.service';
import { StorageService } from '@storage/storage.service';


import { StorageError, StorageErrorCode } from '@error/storage/storage-error';
import { UserError } from '@error/user/user-error';
import { LockError, LockErrorCode } from '@error/lock/lock-error';
import { HandleUserRepoErrors } from '@decorators/handle-user-repo-errors.decorator';

@Injectable()
export class UserRepositoryService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly passwordService: PasswordService,
    private readonly storageService: StorageService,
    private readonly lockService: LockService,
  ) { }

  @HandleUserRepoErrors()
  async loadUserById(id: string): Promise<User> {
    const hashedId = this.encryptionService.getHashedValue(id);
    const encrypted = await this.storageService.read(hashedId);
    const userJson: User = JSON.parse(this.encryptionService.decryptValue(encrypted));
    return userJson;

  }

  @HandleUserRepoErrors()
  async createUser(dto: UserDTO): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(dto.id);
    const uuid = uuidv4();

    const userJson: User = {
      uuid,
      id: dto.id,
      password: await this.passwordService.getHashedValue(dto.password),
      host_list: [],
      db_list: [],
      ha_mon_list: [],
      resource_mon_list: [],
    };
    await this.storageService.createAndWrite(hashedId, this.encryptionService.encryptValue(JSON.stringify(userJson)));

  }
  @HandleUserRepoErrors()
  async deleteUser(id: string): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    await this.storageService.delete(hashedId);

  }

  @HandleUserRepoErrors()
  async updateUser(id: string, userJson: User): Promise<void> {
    const hashedId = this.encryptionService.getHashedValue(id);
    const encrypted = this.encryptionService.encryptValue(JSON.stringify(userJson));
    await this.storageService.write(hashedId, encrypted);
  }

  @HandleUserRepoErrors()
  async atomicUpdateUser(id: string, modifierCallback: (user: User) => Promise<User>): Promise<User> {

    const hashedId = this.encryptionService.getHashedValue(id);

    const updated = await this.lockService.withLock(hashedId, async () => {
      const encrypted: string = await this.storageService.readUnsafe(hashedId);
      const decrypted: string = await this.encryptionService.decryptValue(encrypted);
      const userJson: User = await JSON.parse(decrypted);

      await modifierCallback(userJson);

      const newEncryted = await this.encryptionService.encryptValue(JSON.stringify(userJson));
      await this.storageService.writeUnsafe(hashedId, newEncryted);

      return userJson;
    })
    return updated;
  }
}
