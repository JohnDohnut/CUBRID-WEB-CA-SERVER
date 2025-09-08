import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '@security/password/password.service';
import { User } from '@type/user';
import { UserRepositoryService } from '../repository/user-repository/user-repository.service';
import { UserDTO } from '@type/dto/user.dto';
import { UserError } from '@error/user/user-error';

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
      throw UserError.UserNotFound({ userId: dto.id });
    }

    const ok = await this.password.compareHash(dto.password, user.password);
    if (!ok) {
      throw UserError.UserNotFound({ userId: dto.id });
    }

    const payload = { sub: user.id };
    const token = await this.jwt.signAsync(payload);
    return token;
  }

  async register(dto: UserDTO): Promise<void> {
    await this.usersRepo.createUser(dto);
  }
}
