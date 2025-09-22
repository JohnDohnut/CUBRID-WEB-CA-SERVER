import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository/user-repository/user-repository.service';
import { PasswordService } from '@security/password/password.service';
import { ChangePasswordRequest } from '@type/request/change-password-request';
import { User } from '@type/user';
import { UserError } from '@error/user/user-error';
import { passwordValidityChecker } from '@util/password-validity-checker';
import { HandleUserErrors } from '@decorators/handle-user-errors.decorator';
import { omitPassword } from '../util';
import { UpdateUserInfoRequest } from '../type/request/update-user-info-request';

@Injectable()
export class UserService {

    constructor(
        private readonly repository: UserRepositoryService,
        private readonly password: PasswordService,

    ) { }
    @HandleUserErrors()
    async changePassword(userId: string, dto: ChangePasswordRequest) {


        const changePasswordCallback = async (user: User): Promise<User> => {
            if (await this.password.comparePlainAndHash(dto.oldPassword, user.password)) {
                if (!passwordValidityChecker(dto.newPassword)) {
                    throw UserError.BadNewPassword();
                }
            }
            else {
                throw UserError.OldPasswordMismatch();
            }

            user.password = await this.password.getHashedValue(dto.newPassword);

            return user;

        }
        await this.repository.atomicUpdateUser(userId, changePasswordCallback)
    }

    @HandleUserErrors()
    async getUserData(userId: string): Promise<Omit<User, "password">> {

        return omitPassword(await this.repository.loadUserById(userId));

    }

    @HandleUserErrors()
    async deleteUser(userId: string) : Promise<void> {
        await this.repository.deleteUser(userId);
    }

    @HandleUserErrors()
    async updateUser(userId: string, update: UpdateUserInfoRequest) : Promise<User>{
        return await this.repository.atomicUpdateUser(userId, async (user: User) => {
            Object.entries(update).forEach(([key, value]) => {
                (user as any)[key] = value;
            });
            return user;
        });
    }
}
