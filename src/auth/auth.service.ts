// src/modules/auth/auth.service.ts
import { ControllerException } from '@error/controller/controller-exception';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ControllerErrorCode } from '@root/src/error/controller/controller-error-code';
import { PasswordService } from '@security/password/password.service';
import { User } from '@type/index';
import { UserRepositoryService } from '../repository/user-repository/user-repository.service';
import { UserDTO } from './dto/request-create-user.dto';

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
    await this.usersRepo.createUser(dto);
  }
}
