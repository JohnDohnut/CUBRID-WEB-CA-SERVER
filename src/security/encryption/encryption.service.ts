import { ConfigService } from '@config/config.service';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
@Injectable()
export class EncryptionService {

    constructor (private readonly configService : ConfigService) {}
    private readonly algorithm = 'aes-256-cbc';

    getHashedValue (plain : string | number)
    {
        const hash = crypto.createHash('sha256');
        if(typeof(plain) == 'number'){
            plain= plain.toString();
        }
        return hash.update(plain).digest('hex');
    }

    encryptValue (plain : string):string {
        const key = Buffer.from(this.configService.getSecretKey(), 'hex');
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
        

    }
    decryptValue (cipher : string):string {
        
        const [ivHex, encryptedHex] = cipher.split(':');
        
        const key = Buffer.from(this.configService.getSecretKey(), 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');

    }

}
