import { StorageErrorCode, StorageError } from '@error/storage/storage-error';
import { Injectable } from '@nestjs/common';
import {
    getStoragePath,
    resolveUserFilePath,
} from '@util/resolve-storage-path';
import * as fs from 'fs/promises';
import { LockService } from '@lock/lock.service';
import { HandleStorageFsErrors } from '@decorators/handle-storage-fs-errors.decorator';

/**
 * Service for managing file storage operations.
 * 파일 스토리지 작업을 관리하는 서비스입니다.
 *
 * Provides functionality for file storage, retrieval, and management.
 * Handles file system operations and storage path resolution.
 *
 * 파일 스토리지, 검색, 관리 기능을 제공합니다.
 * 파일 시스템 작업과 스토리지 경로 해결을 처리합니다.
 *
 * @category Infrastructure Services
 * @since 1.0.0
 */
@Injectable()
export class StorageService {
    constructor(private readonly lockService: LockService) {
        this.initializeStorageDirectory();
    }

    private async initializeStorageDirectory(): Promise<void> {
        try {
            await fs.mkdir(getStoragePath(), { recursive: true });
        } catch (err) {
            // Ignore errors if directory already exists
            if (err?.code !== 'EEXIST') {
                console.warn(
                    'Failed to initialize storage directory:',
                    err?.message,
                );
            }
        }
    }

    private handleFsError(err: any): never {
        switch (err?.code) {
            case 'ENOENT':
                throw StorageError.NotFound({ filePath: err.path }, err);
            case 'EEXIST':
                throw StorageError.AlreadyExists({ filePath: err.path }, err);
            case 'EACCES':
            case 'EPERM':
                throw StorageError.PermissionDenied(
                    { filePath: err.path },
                    err,
                );
            default:
                throw StorageError.Unknown(
                    {
                        originalCode: err?.code,
                        originalMessage: err?.message,
                    },
                    err,
                );
        }
    }

    resolveFilePath(filename: string) {
        return resolveUserFilePath(filename);
    }

    // The non-Raw function follows these steps:
    // 1. Creates a temporary file.
    // 2. Writes the data to the temporary file.
    // 3. Renames the temporary file to the final file.
    // 4. Deletes the temporary file.
    // 5. Handles any errors that occur.
    // This approach is used to avoid race conditions when multiple processes attempt to write to the same file at the same time.
    // The content of the temporary file, once renamed, becomes the final content of the file.
    // Additionally, the non-Raw function internally calls the corresponding Raw function as a callback to the withLock function, ensuring synchronization and safe file access.

    @HandleStorageFsErrors()
    async readUnsafe(filename: string): Promise<string> {
        const filePath = resolveUserFilePath(filename);
        return await fs.readFile(filePath, 'utf-8');
    }

    @HandleStorageFsErrors()
    async read(filename: string): Promise<string> {
        return this.lockService.withLock(filename, async () => {
            return await this.readUnsafe(filename);
        });
    }

    @HandleStorageFsErrors()
    async writeUnsafe(filename: string, data: string): Promise<void> {
        const filePath = resolveUserFilePath(filename);
        const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`;

        await fs.writeFile(tmp, data, 'utf-8');
        await fs.rename(tmp, filePath);
        await fs.rm(tmp, { force: true });
    }

    async write(filename: string, data: string): Promise<void> {
        return this.lockService.withLock(filename, async () => {
            return this.writeUnsafe(filename, data);
        });
    }

    @HandleStorageFsErrors()
    async createUnsafe(filename: string): Promise<void> {
        const filePath = resolveUserFilePath(filename);
        await fs.mkdir(getStoragePath(), { recursive: true });
        await fs.writeFile(filePath, '', { flag: 'wx' });
    }

    async create(filename: string): Promise<string> {
        return this.lockService.withLock(filename, async () => {
            await this.createUnsafe(filename);
            return filename;
        });
    }

    @HandleStorageFsErrors()
    async createAndWriteUnsafe(filename: string, data: string): Promise<void> {
        const filePath = resolveUserFilePath(filename);
        await fs.mkdir(getStoragePath(), { recursive: true });
        await fs.writeFile(filePath, data, { flag: 'wx', encoding: 'utf-8' });
    }

    async createAndWrite(filename: string, data: string): Promise<string> {
        return this.lockService.withLock(filename, async () => {
            await this.createAndWriteUnsafe(filename, data);
            return filename;
        });
    }

    @HandleStorageFsErrors()
    async deleteUnsafe(filename: string): Promise<void> {
        const filePath = resolveUserFilePath(filename);
        await fs.rm(filePath, { force: true });
    }

    async delete(filename: string): Promise<void> {
        return this.lockService.withLock(filename, async () => {
            return this.deleteUnsafe(filename);
        });
    }
}
