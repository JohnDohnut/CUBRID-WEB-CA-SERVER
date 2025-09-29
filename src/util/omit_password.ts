export function omitPassword <T extends {password:any}> (param : T){
    const {password, ...rv} = param;
    return rv;

}

export function omitPasswordArray<T extends { password : any } >(param : T[]) : Omit<T,"password">[] {
    return param.map(({ password, ...rv }) => rv as Omit<T, "password">);
}

export function omitPasswordHashMap<T extends { password: any }>(hashMap: Record<string, T>): Record<string, Omit<T, "password">> {
    const result: Record<string, Omit<T, "password">> = {};
    
    for (const [key, value] of Object.entries(hashMap)) {
        const { password, ...rv } = value;
        result[key] = rv as Omit<T, "password">;
    }
    
    return result;
} 