import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { StorageErrorCode, StorageException } from '../error/storage/storage-exception';
import { LockService, FileLock } from '../lock/lock.service';

@Injectable()
export class StorageService {
  constructor(private readonly lockService: LockService) {}

  private readonly storageDir = path.join(process.cwd(), 'storage');

  private resolvePath(filename: string) {
    return path.join(this.storageDir, filename);
  }

  /** 공통 에러 핸들러 */
  private handleFsError(err: any): never {
    switch (err?.code) {
      case 'ENOENT': throw new StorageException(StorageErrorCode.FILE_NOT_FOUND);
      case 'EEXIST': throw new StorageException(StorageErrorCode.FILE_ALREADY_EXISTS);
      case 'EACCES':
      case 'EPERM':  throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
      default:       throw new StorageException(StorageErrorCode.UNKNOWN, err?.message ?? String(err));
    }
  }

  // -------------------------
  // Low-level raw fs methods
  // -------------------------

  async readRaw(filename: string): Promise<string> {
    const filePath = this.resolvePath(filename);
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async writeRaw(filename: string, data: string): Promise<void> {
    const filePath = this.resolvePath(filename);
    const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`;
    try {
      await fs.writeFile(tmp, data, 'utf-8');
      await fs.rename(tmp, filePath); // 원자 교체
    } catch (err) {
      try { await fs.unlink(tmp); } catch {}
      this.handleFsError(err);
    }
  }

  async createRaw(filename: string): Promise<void> {
    const filePath = this.resolvePath(filename);
    await fs.mkdir(this.storageDir, { recursive: true });
    try {
      await fs.writeFile(filePath, '', { flag: 'wx' });
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async createAndWriteRaw(filename: string, data: string): Promise<void> {
    const filePath = this.resolvePath(filename);
    await fs.mkdir(this.storageDir, { recursive: true });
    try {
      await fs.writeFile(filePath, data, { flag: 'wx', encoding: 'utf-8' });
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async deleteRaw(filename: string): Promise<void> {
    const filePath = this.resolvePath(filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      this.handleFsError(err);
    }
  }

  // -------------------------
  // High-level lock wrapped API
  // -------------------------

  async read(filename: string): Promise<string> {
    return this.lockService.withLock(filename, async () => {
      return this.readRaw(filename);
    });
  }

  async write(filename: string, data: string): Promise<void> {
    return this.lockService.withLock(filename, async () => {
      return this.writeRaw(filename, data);
    });
  }

  async create(filename: string): Promise<string> {
    return this.lockService.withLock(filename, async () => {
      await this.createRaw(filename);
      return filename;
    });
  }

  async createAndWrite(filename: string, data: string): Promise<string> {
    return this.lockService.withLock(filename, async () => {
      await this.createAndWriteRaw(filename, data);
      return filename;
    });
  }

  async delete(filename: string): Promise<void> {
    return this.lockService.withLock(filename, async () => {
      return this.deleteRaw(filename);
    });
  }
}
