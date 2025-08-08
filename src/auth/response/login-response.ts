export type LoginResponse = {
    token : string;
}

export function CreateLoginResponse(token : string) {
    const response : LoginResponse = {
       token : token 
    }
    return response;
}