import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as lockfile from 'proper-lockfile';
import { LockError, LockErrorCode } from '@error/lock/lock-error';
import { AppError } from '@error/app-error';
import { HandleLockFsErrors } from '@common';

/**
 * Service for managing file locking operations.
 *
 * Provides functionality for file locking using proper-lockfile library.
 * Handles lock acquisition, release, and stale lock detection.
 *
 * @category Infrastructure Services
 * @since 1.0.0
 */

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

    private resolvePath(filename: string) {
        return path.join(this.storageDir, filename);
    }

    @HandleLockFsErrors()
    private async acquireInternal(filename: string): Promise<FileLock> {
        const filePath = this.resolvePath(filename);
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        try {
            const release = await lockfile.lock(filePath, {
                stale: 30_000,
                realpath: false,
                retries: {
                    retries: 50,  // 재시도 횟수 증가
                    factor: 1.2,  // 재시도 간격 증가율 감소
                    minTimeout: 50,  // 최소 대기 시간 감소
                    maxTimeout: 2000,  // 최대 대기 시간 증가
                },
            });
            return { filePath, release };
        } catch (err: any) {
            // 에러는 데코레이터에서 처리됨
            throw err;
        }
    }

    @HandleLockFsErrors()
    async acquire(filename: string): Promise<FileLock> {
        return this.acquireInternal(filename);
    }

    @HandleLockFsErrors()
    async release(lock: FileLock): Promise<void> {
        await lock.release();
    }
    @HandleLockFsErrors()
    async withLock<T>(filename: string, work: () => Promise<T>): Promise<T> {
        const lock = await this.acquire(filename);
        let workerError: any = null;

        try {
            Logger.log("with lock work")
            return await work();
        } catch (error) {
            // worker 메서드에서 발생한 에러를 저장하고 다시 던짐
            Logger.log('with lock error');
            workerError = error;
            throw error;
        } finally {
            // lock 해제는 항상 시도하되, 실패해도 worker 에러를 덮어쓰지 않음
            try {
                await this.release(lock);
            } catch (releaseError) {
                // worker 에러가 있었다면 두 에러를 모두 보존
                Logger.log('release error occurred')
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
                                    stack: releaseError.stack,
                                },
                            },
                            workerError.originalError,
                        );

                        // 원본 에러의 메시지와 이름 유지
                        enhancedError.message = workerError.message;
                        enhancedError.name = workerError.name;

                        throw enhancedError;
                    } else {
                        // 일반 Error인 경우 기존 방식 사용
                        workerError.suppressedError = releaseError;
                        workerError.message += ` (Lock release also failed: ${releaseError.message})`;
                        throw workerError;
                    }
                } else {
                    // worker 에러가 없었다면 lock 해제 에러를 던짐

                    throw releaseError;
                }
            }
        }
    }
}
