import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as lockfile from 'proper-lockfile';
import { LockError, LockErrorCode } from '@error/lock/lock-error';
import { AppError } from '@error/app-error';

export interface LockErrorDetails {
    message: string;
    code: string;
    stack?: string;
}

export interface LockServiceDetails {
    lockReleaseFailed?: boolean;
    lockReleaseError?: LockErrorDetails;
    [key: string]: unknown;
}




export interface FileLock {
    filePath: string;
    release: () => Promise<void>;
}

@Injectable()
export class LockService {
    private readonly storageDir = path.join(process.cwd(), 'storage');

    private handleFsError(err: any): never {
        switch (err?.code) {
            // 파일 시스템 에러
            case 'ENOENT': 
                throw LockError.LockNotFound({ filePath: err.path }, err);
            case 'EACCES':
            case 'EPERM': 
                throw LockError.PermissionDenied({ filePath: err.path }, err);
            case 'EEXIST': 
                throw LockError.LockAlreadyHeld({ filePath: err.path }, err);
            
            // proper-lockfile library error
            case 'ELOCKED': 
                throw LockError.LockAlreadyHeld({ filePath: err.file }, err);
            case 'ENOTACQUIRED': 
                throw LockError.LockNotFound({ filePath: err.file }, err);
            case 'ECOMPROMISED': 
                throw LockError.Unknown({ reason: 'Lock compromised', filePath: err.file }, err);
            case 'ERELEASED': 
                throw LockError.LockNotFound({ reason: 'Lock already released', filePath: err.file }, err);
            
            default: 
                throw LockError.Unknown({ originalCode: err?.code }, err);
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
        } catch (error) {
            this.handleFsError(error);
        }
    }

    async withLock<T>(filename: string, work: () => Promise<T>): Promise<T> {
        const lock = await this.acquireInternal(filename);
        let workerError: any = null;
        
        try {
            return await work();
        } catch (error) {
            // worker 메서드에서 발생한 에러를 저장하고 다시 던짐
            workerError = error;
            throw error;
        } finally {
            // lock 해제는 항상 시도하되, 실패해도 worker 에러를 덮어쓰지 않음
            try {
                await this.release(lock);
            } catch (releaseError) {
                // worker 에러가 있었다면 두 에러를 모두 보존
                if (workerError) {
                    // AppError인 경우 additionalData에 lock 해제 실패 정보 추가
                    if (workerError instanceof AppError) {
                        // 새로운 AppError 생성 (기존 에러 정보 + lock 해제 실패 정보)
                        const enhancedError = new AppError(
                            workerError.kind,
                            workerError.code,
                            {
                                ...workerError.additionalData,
                                lockReleaseFailed: true,
                                lockReleaseError: {
                                    message: releaseError.message,
                                    code: releaseError.code || 'UNKNOWN',
                                    stack: releaseError.stack
                                }
                            },
                            workerError.originalError
                        );
                        
                        // 원본 에러의 메시지와 이름 유지
                        enhancedError.message = workerError.message;
                        enhancedError.name = workerError.name;
                        
                        throw enhancedError;
                    } else {
                        // 일반 Error인 경우 기존 방식 사용
                        workerError.suppressedError = releaseError;
                        workerError.message += ` (Lock release also failed: ${releaseError.message})`;
                    }
                } else {
                    // worker 에러가 없었다면 lock 해제 에러를 던짐
                    this.handleFsError(releaseError);
                }
            }
        }
    }
}
