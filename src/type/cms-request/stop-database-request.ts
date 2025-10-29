import { BaseCmsRequest } from "./base-cms-request";

export type StopDatabaseRequest = BaseCmsRequest & {
    dbname: string;
}

