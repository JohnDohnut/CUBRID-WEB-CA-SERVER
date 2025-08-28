import { StorageErrorCode, StorageException } from '@error/storage/storage-exception';
import { Injectable } from '@nestjs/common';
import { getStoragePath, resolveUserFilePath } from '@util/.';
import * as fs from 'fs/promises';
import { LockService } from '../lock/lock.service';

@Injectable()
export class StorageService {
  constructor(private readonly lockService: LockService) {}
  

  private handleFsError(err: any): never {
    switch (err?.code) {
      case 'ENOENT': throw new StorageException(StorageErrorCode.FILE_NOT_FOUND);
      case 'EEXIST': throw new StorageException(StorageErrorCode.FILE_ALREADY_EXISTS);
      case 'EACCES':
      case 'EPERM':  throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
      default:       throw new StorageException(StorageErrorCode.UNKNOWN, err?.message ?? String(err));
    }
  }

  resolveFilePath(filename:string){
    return resolveUserFilePath(filename);
  }

  async readRaw(filename: string): Promise<string> {
    const filePath = resolveUserFilePath(filename);
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async writeRaw(filename: string, data: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`;
    try {
      await fs.writeFile(tmp, data, 'utf-8');
      await fs.rename(tmp, filePath); 
    } catch (err) {
      try { await fs.unlink(tmp); } catch {}
      this.handleFsError(err);
    }
  }

  async createRaw(filename: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    await fs.mkdir(getStoragePath(), { recursive: true });
    try {
      await fs.writeFile(filePath, '', { flag: 'wx' });
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async createAndWriteRaw(filename: string, data: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    await fs.mkdir(getStoragePath(), { recursive: true });
    try {
      await fs.writeFile(filePath, data, { flag: 'wx', encoding: 'utf-8' });
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async deleteRaw(filename: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      this.handleFsError(err);
    }
  }

  async read(filename: string): Promise<string> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      return this.readRaw(filePath);
    });
  }

  async write(filename: string, data: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      return this.writeRaw(filePath, data);
    });
  }

  async create(filename: string): Promise<string> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      await this.createRaw(filePath);
      return filename;
    });
  }

  async createAndWrite(filename: string, data: string): Promise<string> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      await this.createAndWriteRaw(filePath, data);
      return filename;
    });
  }

  async delete(filename: string): Promise<void> {
    const filePath = resolveUserFilePath(filename);
    return this.lockService.withLock(filePath, async () => {
      return this.deleteRaw(filePath);
    });
  }

 
}
