export function omitPassword <T extends {password:any}> (param : T){
    const {password, ...rv} = param;
    return rv;

}

export function omitPasswordArray<T extends { password : any } >(param : T[]) : Omit<T,"password">[] {

    return param.map(({ password, ...rv }) => rv as Omit<T, "password">);

} 