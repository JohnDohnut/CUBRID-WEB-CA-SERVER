import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class ConfigService {
  public seed!: string;
  public salt!: string;
  public port: string = '8080';
  public secret_key!: string;

  constructor() {
    const args = parseArgs(process.argv.slice(2)); // Corrected slice index

    // 1. Validate required arguments (SEED and SALT)
    if (!args.SEED || !args.SALT) {
      throw new Error(
        'SEED and SALT must be provided as command-line arguments (e.g., --SEED=... --SALT=...).',
      );
    }
    this.seed = args.SEED;
    this.salt = args.SALT;

    // 2. Validate PORT
    if (args.PORT) {
      const portNumber = parseInt(args.PORT, 10);
      if (isNaN(portNumber) || portNumber <= 0 || portNumber > 65535) {
        throw new Error(
          `Invalid PORT provided: "${args.PORT}". Port must be a number between 1 and 65535.`,
        );
      }
      this.port = args.PORT;
    } else {
      this.port = '8080'; // Default port
    }

    // 3. Derive secret key
    const derived = crypto.pbkdf2Sync(
      this.seed,
      this.salt,
      100_000,
      32,
      'sha256',
    );
    this.secret_key = derived.toString('hex');
    // This would catch errors from pbkdf2Sync if inputs are wrong type, etc.

  }

  getSecretKey() {
    return this.secret_key;
  }

  getPort() {
    return this.port;
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
