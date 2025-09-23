import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from '@repository';
import { PasswordService } from '@security';
import { ChangePasswordRequest } from '@type/request/change-password-request';
import { User } from '@type/user';
import { UserError } from '@error/user/user-error';
import { passwordValidityChecker } from '@util';
import { HandleUserErrors } from '@common';
import { omitPassword } from '@util';
import { UpdateUserInfoRequest } from '@type/request/update-user-info-request';

/**
 * Service for managing user-related operations.
 * 
 * Provides business logic for user data management including password changes,
 * user data retrieval, account deletion, and user information updates.
 * All operations are wrapped with error handling decorators.
 * 
 * @category Services/Business Services
 * @since 1.0.0
 */
@Injectable()
export class UserService {

    constructor(
        private readonly repository: UserRepositoryService,
        private readonly password: PasswordService,

    ) { }
    /**
     * Changes a user's password with validation.
     * 
     * Validates the old password against the stored hash and ensures the new password
     * meets security requirements before updating. Uses atomic update to ensure
     * data consistency.
     * 
     * @param {string} userId - The unique identifier of the user
     * @param {ChangePasswordRequest} dto - Password change request containing old and new passwords
     * @returns {Promise<void>} No return value on success
     * @throws {UserError} When old password is incorrect or new password is invalid
     * @example
     * ```typescript
     * await userService.changePassword("user123", {
     *   oldPassword: "oldpass123",
     *   newPassword: "newpass456"
     * });
     * ```
     */
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

    /**
     * Retrieves user data excluding the password field.
     * 
     * Loads user information from the repository and removes the password field
     * for security purposes before returning the data.
     * 
     * @param {string} userId - The unique identifier of the user
     * @returns {Promise<Omit<User, "password">>} User data without password
     * @throws {UserError} When user is not found
     * @example
     * ```typescript
     * const userData = await userService.getUserData("user123");
     * console.log(userData.department); // "IT"
     * // userData.password is undefined
     * ```
     */
    @HandleUserErrors()
    async getUserData(userId: string): Promise<Omit<User, "password">> {

        return omitPassword(await this.repository.loadUserById(userId));

    }

    /**
     * Permanently deletes a user account.
     * 
     * Removes the user and all associated data from the repository.
     * This operation cannot be undone.
     * 
     * @param {string} userId - The unique identifier of the user to delete
     * @returns {Promise<void>} No return value on success
     * @throws {UserError} When user is not found
     * @example
     * ```typescript
     * await userService.deleteUser("user123");
     * // User account is permanently deleted
     * ```
     */
    @HandleUserErrors()
    async deleteUser(userId: string) : Promise<void> {
        await this.repository.deleteUser(userId);
    }

    /**
     * Updates user information with provided data.
     * 
     * Updates specific user fields based on the provided update object.
     * Uses atomic update to ensure data consistency. Only fields present
     * in the update object will be modified.
     * 
     * @param {string} userId - The unique identifier of the user
     * @param {UpdateUserInfoRequest} update - Object containing fields to update
     * @returns {Promise<User>} The updated user object
     * @throws {UserError} When user is not found or update fails
     * @example
     * ```typescript
     * const updatedUser = await userService.updateUser("user123", {
     *   department: "Engineering"
     * });
     * console.log(updatedUser.department); // "Engineering"
     * ```
     */
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
