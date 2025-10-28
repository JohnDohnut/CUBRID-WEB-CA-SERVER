import { BaseCmsResponse } from "./BaseCmsResponse"

export type StartInfoResponse = BaseCmsResponse & {
    activelist : {
        active : {dbname : string}[]
    },
    dblist:{
        dbs : {
            dbdir:string,
            dbname:string,
        }[]
    }
}