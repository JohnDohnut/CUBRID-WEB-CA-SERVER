import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class PasswordService {
    
    private readonly HASH_ROUND = 10;

    async compareHash (plain:string, hash:string) : Promise<boolean>{
        return await bcrypt.compare(plain, hash)
    }

    async getHashedValue(plain : string | number) : Promise<string>{
        const textPlain = plain.toString();
        const hashed = await bcrypt.hash(textPlain, this.HASH_ROUND);
        return hashed;
    }


}
