import { BaseCmsResponse } from "../cms-response";

export type LoginDBCmsResponse = BaseCmsResponse & {
    authority : string,
    dbname : string,
}