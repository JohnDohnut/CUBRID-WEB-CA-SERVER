
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()

export class StorageService {
    

    private readonly storageDir = path.join(process.cwd(),'storage');
    
    async getFilePathIfExists(filename : string) : Promise<string | null>{
        const filePath = path.join(this.storageDir, filename);

        try{
            await fs.access(filePath);
            return filePath;
        }
        catch{
            return null;
        }

    }

    async read(filename: string): Promise<string>{
        const filePath = path.join(this.storageDir, filename);
        const encryptedData = await fs.readFile(filePath, 'utf-8');
        return encryptedData;
    }

    async write(filename: string, data: string): Promise<void>{
        await fs.mkdir(this.storageDir, { recursive: true });
        const filePath = path.join(this.storageDir, filename);
        await fs.writeFile(filePath, data, 'utf-8');
    }

    async create(filename : string) : Promise<string> {
        await fs.mkdir(this.storageDir, { recursive: true });
        const filePath = path.join(this.storageDir, filename);
        try{
            await fs.writeFile(filePath, '', {flag: 'wx'});
            return filePath;
        }
        catch(err){
            if((err as NodeJS.ErrnoException).code === 'EEXIST'){
                console.log('\t|! User (File) already exists.');
            }
            throw(err);
        }
        
    }

    async deleteFile(filename : string) : Promise<void> {
        const filePath = path.join(this.storageDir, filename);
        try{
            await fs.access(filePath);
            await fs.unlink(filePath);
        }
        catch(err){
            if((err as NodeJS.ErrnoException).code === 'ENOENT'){
                console.log('\t|! User (File) does not exist');        
            }
            throw(err);
        }
    }

}
