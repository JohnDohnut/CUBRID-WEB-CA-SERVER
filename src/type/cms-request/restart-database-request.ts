import { BaseCmsRequest } from "./base-cms-request";

export type RestartDatabaseRequest = BaseCmsRequest & {
    dbname: string;
}

