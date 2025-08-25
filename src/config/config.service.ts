import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';


@Injectable()
export class ConfigService{

    public seed! : string;
    public salt! : string;
    public secret_key!: string;
    

    constructor() {
        const args = parseArgs(process.argv.slice(2));
        
        this.seed = args.SEED;
        this.salt = args.SALT;
        
        if (!this.seed || !this.salt) {
        throw new Error('SEED and SALT must be provided as CLI args or environment variables.');
        }

        const derived = crypto.pbkdf2Sync(this.seed, this.salt, 100_000, 32, 'sha256');
        this.secret_key = derived.toString('hex');



    }

    getSecretKey() {
        return this.secret_key;
    }
}

function parseArgs(argv: string[]): Record<string, string> {
    const result: Record<string, string> = {};
  
    for (const arg of argv) {
      if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        result[key] = value;
      }
    }
  
    return result;
  }
