import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as lockfile from 'proper-lockfile';
import { StorageErrorCode, StorageException } from '../error/storage/storage-exception';

@Injectable()
export class StorageService {
  private readonly storageDir = path.join(process.cwd(), 'storage');

  private resolvePath(filename: string) {
    return path.join(this.storageDir, filename);
  }

  /** 파일별 배타 락 */
  private async withLock<T>(filename: string, work: () => Promise<T>): Promise<T> {
    const filePath = this.resolvePath(filename);
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    let release: lockfile.Release | null = null;
    try {
      release = await lockfile.lock(filePath, {
        stale: 30_000,
        realpath: false,
        retries: { retries: 10, factor: 1.5, minTimeout: 100, maxTimeout: 1000 },
      });
    } catch (err: any) {
      const msg = String(err?.message ?? '');
      if (msg.includes('already being held')) {
        throw new StorageException(StorageErrorCode.FILE_LOCKED, msg);
      }
      throw new StorageException(StorageErrorCode.UNKNOWN, msg);
    }

    try {
      return await work();
    } finally {
      if (release) { try { await release(); } catch {} }
    }
  }

  async read(filename: string): Promise<string> {
    const filePath = this.resolvePath(filename);
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (err: any) {
      switch (err?.code) {
        case 'ENOENT': throw new StorageException(StorageErrorCode.FILE_NOT_FOUND);
        case 'EACCES':
        case 'EPERM':  throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
        default:       throw new StorageException(StorageErrorCode.UNKNOWN, err?.message);
      }
    }
  }

  /** 존재해야만 쓰는 업데이트 전용: 락 + tmp→rename */
  async write(filename: string, data: string): Promise<void> {
    const filePath = this.resolvePath(filename);
    try { await fs.access(filePath); } 
    catch { throw new StorageException(StorageErrorCode.FILE_NOT_FOUND); }

    await this.withLock(filename, async () => {
      const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`;
      try {
        await fs.writeFile(tmp, data, { encoding: 'utf-8' });
        await fs.rename(tmp, filePath); // 원자 교체
      } catch (err: any) {
        try { await fs.unlink(tmp); } catch {}
        switch (err?.code) {
          case 'EACCES':
          case 'EPERM':  throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
          default:       throw new StorageException(StorageErrorCode.UNKNOWN, err?.message);
        }
      }
    });
  }

  /** 새 파일 만들기. 이미 있으면 에러. 성공 시 전달받은 filename을 그대로 반환 */
  async create(filename: string): Promise<string> {
    const filePath = this.resolvePath(filename);
    await fs.mkdir(this.storageDir, { recursive: true });
    try {
      await fs.writeFile(filePath, '', { flag: 'wx' });
      return filename; // <- 요청대로 filename 반환
    } catch (err: any) {
      switch (err?.code) {
        case 'EEXIST':  throw new StorageException(StorageErrorCode.FILE_ALREADY_EXISTS);
        case 'EACCES':
        case 'EPERM':   throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
        default:        throw new StorageException(StorageErrorCode.UNKNOWN, err?.message);
      }
    }
  }

  /** 생성 + 초기쓰기(동시성 안전). 성공 시 filename 반환 */
  async createAndWrite(filename: string, data: string): Promise<string> {
    await this.withLock(filename, async () => {
      const filePath = this.resolvePath(filename);
      await fs.writeFile(filePath, data, { flag: 'wx', encoding: 'utf-8' });
    }).catch((err: any) => {
      switch (err?.code) {
        case 'EEXIST':  throw new StorageException(StorageErrorCode.FILE_ALREADY_EXISTS);
        case 'EACCES':
        case 'EPERM':   throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
        default:
          if (err instanceof StorageException) throw err;
          throw new StorageException(StorageErrorCode.UNKNOWN, err?.message);
      }
    });
    return filename;
  }

  async delete(filename: string): Promise<void> {
    const filePath = this.resolvePath(filename);
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (err: any) {
      switch (err?.code) {
        case 'ENOENT': throw new StorageException(StorageErrorCode.FILE_NOT_FOUND);
        case 'EACCES':
        case 'EPERM':  throw new StorageException(StorageErrorCode.PERMISSION_DENIED);
        default:       throw new StorageException(StorageErrorCode.UNKNOWN, err?.message);
      }
    }
  }
}
