import * as path from "path";

export function getStoragePath(){
    // For pkg executables, use the directory where the executable is located
    const executableDir = path.dirname(process.execPath);
    return path.join(executableDir, 'storage');
}
export function resolveUserFilePath(filename: string){
    const storageDir = getStoragePath();
    return path.join(storageDir, filename);
}