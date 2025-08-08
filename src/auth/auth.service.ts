import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { EncryptionService } from '@encryption/encryption.service';
import { StorageService } from '@storage/storage.service';
import { User, MonitoringHA, MonitoringResource } from '@type/index';
import { ControllerException } from '@root/src/error/controller/controller-exception';
import { ControllerErrorCode } from '@root/src/error/controller/controller-error-code';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly storageService: StorageService,
        private readonly jwtService : JwtService,
    ) { }

  
}
