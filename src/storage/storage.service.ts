
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { StorageErrorCode, StorageException } from '../error/storage/storage-exception';

@Injectable()

export class StorageService {


    private readonly storageDir = path.join(process.cwd(), 'storage');

    async getFilePathIfExists(filename: string): Promise<string | null> {
        const filePath = path.join(this.storageDir, filename);

        try {
            await fs.access(filePath);
            return filePath;
        }
        catch {
            return null;
        }

    }

    async read(filename: string): Promise<string> {
        const filePath = path.join(this.storageDir, filename);
        try {
            const encryptedData = await fs.readFile(filePath, 'utf-8');
            return encryptedData;
        }
        catch (err) {
            const code = (err as NodeJS.ErrnoException).code;
            switch (code) {
                case 'ENOENT':
                    throw new StorageException(StorageErrorCode.FILE_NOT_FOUND);
                case 'EACCES':
                case 'EPERM':
                    throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
                default:
                    throw new StorageException(StorageErrorCode.UNKNOWN);

            }
        }
    }

    async write(filename: string, data: string): Promise<void> {
        await fs.mkdir(this.storageDir, { recursive: true });
        const filePath = path.join(this.storageDir, filename);
        try {
            await fs.writeFile(filePath, data, {flag: "r+", encoding: 'utf-8'});
        }
        catch (err) {
            const code = (err as NodeJS.ErrnoException).code;
            switch (code) {
                case 'EACCES':
                case 'EPERM':
                    throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
                default:
                    throw new StorageException(StorageErrorCode.UNKNOWN);
            }
        }
    }

    async create(filename: string): Promise<string> {
        await fs.mkdir(this.storageDir, { recursive: true });
        const filePath = path.join(this.storageDir, filename);
        try {
            await fs.writeFile(filePath, '', { flag: 'wx' });
            return filePath;
        }
        catch (err) {
            const code = (err as NodeJS.ErrnoException).code
            switch (code) {
                case 'EEXIST':
                    throw new StorageException(StorageErrorCode.FILE_ALREADY_EXISTS);
                case 'EACCES':
                case 'EPERM':
                    throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
                default:
                    throw new StorageException(StorageErrorCode.UNKNOWN, (err as Error).message);

            }

        }

    }

    async delete(filename: string): Promise<void> {
        const filePath = path.join(this.storageDir, filename);
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
        }
        catch (err) {
            const code = (err as NodeJS.ErrnoException).code
            switch (code) {
                case 'ENOENT':
                    throw new StorageException(StorageErrorCode.FILE_NOT_FOUND);
                case 'EACCES':
                case 'EPERM':
                    throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
                default:
                    throw new StorageException(StorageErrorCode.UNKNOWN, (err as Error).message);

            }
           
        }
    }

}
