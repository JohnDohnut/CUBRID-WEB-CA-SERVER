import path from "path";

export function getStoragePath(){
    return path.join(process.cwd(), 'storage');
}
export function resolveUserFilePath(filename: string){
    const storageDir = path.join(process.cwd(), 'storage');
    return path.join(storageDir, filename);
}