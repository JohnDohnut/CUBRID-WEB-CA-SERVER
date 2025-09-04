import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as lockfile from 'proper-lockfile';
import { LockError, LockErrorCode } from '../error/lock/lock-error';




export interface FileLock {
    filePath: string;
    release: () => Promise<void>;
}

@Injectable()
export class LockService {
    private readonly storageDir = path.join(process.cwd(), 'storage');

    private handleFsError(err: any): never {
        switch (err?.code) {
            case 'ENOENT': throw LockError.LockNotFound();
            case 'EEXIST':
            case 'ELOCKED': throw LockError.LockAlreadyHeld();
            case 'EACCES':
            case 'EPERM': throw LockError.PermissionDenied();
            default: throw new LockException(LockErrorCode.UNKNOWN, err?.message ?? String(err));
        }
    }

    private resolvePath(filename: string) {
        return path.join(this.storageDir, filename);
    }

    private async acquireInternal(filename: string): Promise<FileLock> {
        const filePath = this.resolvePath(filename);
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        try {
            const release = await lockfile.lock(filePath, {
                stale: 30_000,
                realpath: false,
                retries: { retries: 10, factor: 1.5, minTimeout: 100, maxTimeout: 1000 },
            });
            return { filePath, release };
        } catch (err: any) {
            this.handleFsError(err);
        }
    }

    

    async acquire(filename: string): Promise<FileLock> {
        return this.acquireInternal(filename);
    }

    async release(lock: FileLock): Promise<void> {
        try {
            await lock.release();
        } catch {
            // release 실패는 무시하거나 로깅
        }
    }

    async withLock<T>(filename: string, work: () => Promise<T>): Promise<T> {
        const lock = await this.acquireInternal(filename);
        try {
            return await work();
        } finally {
            await this.release(lock);
        }
    }
}
