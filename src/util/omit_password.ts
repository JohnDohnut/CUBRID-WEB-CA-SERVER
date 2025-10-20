export function omitPassword<T extends { password: any }>(param: T) {
    const { password, ...rv } = param;
    return rv;
}

export function omitPasswordArray<T extends { password: any }>(
    param: T[],
): Omit<T, 'password'>[] {
    return param.map(({ password, ...rv }) => rv);
}

export function omitPasswordHashMap<T extends { password: any }>(
    hashMap: Record<string, T>,
): Record<string, Omit<T, 'password'>> {
    const result: Record<string, Omit<T, 'password'>> = {};

    for (const [key, value] of Object.entries(hashMap)) {
        const { password, ...rv } = value;
        result[key] = rv;
    }

    return result;
}

// 범용 HashMap Omitter
export function omitHashMap<T, K extends keyof T>(
    hashMap: Record<string, T>,
    keys: K[]
): Record<string, Omit<T, K>> {
    const result: Record<string, Omit<T, K>> = {};
    
    for (const [key, value] of Object.entries(hashMap)) {
        const omittedValue = { ...value };
        keys.forEach(keyToOmit => delete omittedValue[keyToOmit]);
        result[key] = omittedValue as Omit<T, K>;
    }
    
    return result;
}
