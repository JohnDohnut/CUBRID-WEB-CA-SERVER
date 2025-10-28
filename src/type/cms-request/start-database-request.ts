import { BaseCmsRequest } from "./base-cms-request";

export type StartDatabaseRequest = BaseCmsRequest & {
    dbname : string;
}