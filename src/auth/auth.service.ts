// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryService } from '../repository/user-repository/user-repository.service';
import { UserDTO } from './dto/request-create-user.dto';
import { User } from '@type/index';
import { ControllerException } from '@error/controller/controller-exception';
import { ControllerErrorCode } from '@root/src/error/controller/controller-error-code';
import { PasswordService } from '@security/password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UserRepositoryService,
    private readonly jwt: JwtService,
    private readonly password: PasswordService,
  ) {}

  async login(dto: UserDTO): Promise<string> {
    const user: User | null = await this.usersRepo.loadUserById(dto.id);
    if (!user) {
      throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
    }

    const ok = await this.password.compareHash(dto.password, user.password);
    if (!ok) {
      throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
    }

    const payload = { sub: user.id };
    const token = await this.jwt.signAsync(payload);
    return token;
  }

  async register(dto: UserDTO): Promise<void> {
    const exists = await this.usersRepo.loadUserById(dto.id);
    if (exists) {
      throw new ControllerException(
        ControllerErrorCode.USER_ALREADY_EXISTS ?? ControllerErrorCode.INVALID_CREDENTIALS,
      );
    }

    const hashed = await this.password.getHashedValue(dto.password);
    const toCreate = { id: dto.id, password: hashed };
    await this.usersRepo.createUser(toCreate);
  }
}
