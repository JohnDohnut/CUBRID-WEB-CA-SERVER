import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { User } from '@type/user';
import { ChangePasswordRequest } from '@type/request/change-password-request';
import { UserService } from './user.service';
import { UpdateUserInfoRequest } from '@type/request/update-user-info-request';

/**
 * Controller for handling user-related operations.
 * 
 * Provides endpoints for user data management including retrieving user information,
 * changing passwords, updating user details, and account deletion.
 * All endpoints require JWT authentication.
 * 
 * @category Controllers
 * @since 1.0.0
 */
@Controller('user')
export class UserController {

    constructor(
        private readonly userService : UserService,
    ){}

    /**
     * Retrieves the current user's data.
     * 
     * Returns user information excluding the password field for security.
     * The user ID is extracted from the JWT token in the request.
     * 
     * @param {any} req - Express request object containing JWT payload
     * @returns {Promise<Omit<User, "password">>} User data without password
     * @throws {UserError} When user is not found
     * @example
     * ```typescript
     * // GET /user
     * // Returns: { uuid: "123", id: "user1", department: "IT", host_list: [], ... }
     * ```
     */
    @Get()
    async getUserData(@Request() req) : Promise<Omit<User, "password">>{
        const payload = req.user;
        return await this.userService.getUserData(payload.sub);
    }

    /**
     * Changes the user's password.
     * 
     * Validates the old password and sets a new password if validation passes.
     * The new password must meet security requirements.
     * 
     * @param {ChangePasswordRequest} dto - Password change request containing old and new passwords
     * @param {any} req - Express request object containing JWT payload
     * @returns {Promise<void>} No return value on success
     * @throws {UserError} When old password is incorrect or new password is invalid
     * @example
     * ```typescript
     * // POST /user/credential
     * // Body: { oldPassword: "old123", newPassword: "new456" }
     * ```
     */
    @Post('credential')
    async changePassword(@Body() dto : ChangePasswordRequest, @Request() req) : Promise<void>{
        const payload = req.user;
        console.log(payload);
        await this.userService.changePassword(payload.sub, dto);

    }

    /**
     * Deletes the user's account.
     * 
     * Permanently removes the user account and all associated data.
     * This operation cannot be undone.
     * 
     * @param {any} req - Express request object containing JWT payload
     * @returns {Promise<boolean>} Always returns true on successful deletion
     * @throws {UserError} When user is not found
     * @example
     * ```typescript
     * // DELETE /user/account
     * // Returns: true
     * ```
     */
    @Delete('account')
    async deleteUser(@Request() req) : Promise<boolean> {
        await this.userService.deleteUser(req.user.sub);
        return true;
    }
    
    /**
     * Updates user information.
     * 
     * Updates specific user fields based on the provided request body.
     * Only allowed fields can be updated (currently only department).
     * 
     * @param {any} req - Express request object containing JWT payload
     * @param {UpdateUserInfoRequest} body - User information to update
     * @returns {Promise<void>} No return value on success
     * @throws {UserError} When user is not found or update fails
     * @example
     * ```typescript
     * // POST /user/account
     * // Body: { department: "Engineering" }
     * ```
     */
    @Post('account')
    async updateUser(@Request() req, @Body() body : UpdateUserInfoRequest){
    }

}
