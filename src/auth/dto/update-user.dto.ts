import { PartialType } from '@nestjs/mapped-types';
import { UserDTO } from './create-user.dto';

export class UpdateUserDto extends PartialType(UserDTO) {}
