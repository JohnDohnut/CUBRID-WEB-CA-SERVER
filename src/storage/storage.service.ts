import { StorageErrorCode, StorageError } from '@error/storage/storage-error';
import { Injectable } from '@nestjs/common';
import { getStoragePath, resolveUserFilePath } from '@util/resolve-storage-path';
import * as fs from 'fs/promises';
import { LockService } from '../lock/lock.service';

@Injectable()
export class StorageService {
  constructor(private readonly lockService: LockService) { }


  private handleFsError(err: any): never {
    switch (err?.code) {
      case 'ENOENT':
        throw StorageError.NotFound({ filePath: err.path }, err);
      case 'EEXIST':
        throw StorageError.AlreadyExists({ filePath: err.path }, err);
      case 'EACCES':
      case 'EPERM':
        throw StorageError.PermissionDenied({ filePath: err.path }, err);
      default:
        throw StorageError.Unknown({
          originalCode: err?.code,
          originalMessage: err?.message
        }, err);
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

  private async readUnsafe(filename: string): Promise<string> {
    const filePath = resolveUserFilePath(filename);
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async read(filename: string): Promise<string> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      return this.readUnsafe(filePath);
    });
  }

  private async writeUnsafe(filename: string, data: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`;
    try {
      await fs.writeFile(tmp, data, 'utf-8');
      await fs.rename(tmp, filePath);
    } catch (err) {
      try { await fs.unlink(tmp); } catch { }
      this.handleFsError(err);
    }
  }

  async write(filename: string, data: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      return this.writeUnsafe(filePath, data);
    });
  }

  private async createUnsafe(filename: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    await fs.mkdir(getStoragePath(), { recursive: true });
    try {
      await fs.writeFile(filePath, '', { flag: 'wx' });
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async create(filename: string): Promise<string> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      await this.createUnsafe(filePath);
      return filename;
    });
  }

  private async createAndWriteUnsafe(filename: string, data: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    await fs.mkdir(getStoragePath(), { recursive: true });
    try {
      await fs.writeFile(filePath, data, { flag: 'wx', encoding: 'utf-8' });
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async createAndWrite(filename: string, data: string): Promise<string> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      await this.createAndWriteUnsafe(filePath, data);
      return filename;
    });
  }

  private async deleteUnsafe(filename: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async delete(filename: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      return this.deleteUnsafe(filePath);
    });
  }

}
