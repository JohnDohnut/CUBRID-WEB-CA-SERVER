import * as path from 'path';

export function getStoragePath() {
    // Check if running as pkg executable
    const isPkg = !!(process as any).pkg;
    
    if (isPkg) {
        // For pkg executables, use the directory where the executable is located
        const executableDir = path.dirname(process.execPath);
        return path.join(executableDir, 'storage');
    } else {
        // For development mode, use the project root directory
        return path.resolve(__dirname, '..', '..', 'storage');
    }
}
export function resolveUserFilePath(filename: string) {
    const storageDir = getStoragePath();
    return path.join(storageDir, filename);
}
