import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, NotBeforeError, TokenExpiredError } from '@nestjs/jwt';
import { UserRepositoryService } from '../repository/user-repository/user-repository.service';
import { UserDTO as UserDTO } from './dto/create-user.dto';
import { User } from '@type/index';
import { ControllerException } from '@error/controller/controller-exception';
import { ControllerErrorCode } from '@root/src/error/controller/controller-error-code';
import { PasswordService } from '@security/password/password.service';
import { StorageException } from '../error/storage/storage-exception';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepositoryService: UserRepositoryService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
    ) { }

    async login(userDTO: UserDTO): Promise<string> {
        const user: User = await this.userRepositoryService.loadUserById(userDTO.id);
        if (!this.passwordService.compareHash(userDTO.password, user.password)) {
            throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
        }
        const payload = { sub: userDTO.id }
        const token = this.jwtService.sign(payload);
        return token;
    }

    async register(userDTO: UserDTO) {

        this.userRepositoryService.createUser(userDTO);

    }

    async validateToken(token: string) : Promise<User> {
        try {
            const payload: { sub: string } = await this.jwtService.verifyAsync(token);
            const userJson : User = await this.userRepositoryService.loadUserById(payload.sub);
            return userJson;

        }
        catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new ControllerException(ControllerErrorCode.TOKEN_EXPIRED);
            }
            if (err instanceof JsonWebTokenError) {
                throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
            }
            if (err instanceof NotBeforeError) {
                throw new ControllerException(ControllerErrorCode.INVALID_CREDENTIALS);
            }
            if (err instanceof StorageException){
                throw err;
            }
            if (err instanceof ControllerException){
                throw err;
            }
            throw new ControllerException(ControllerErrorCode.INTERNAL_ERROR);
        }

    }

}
    


