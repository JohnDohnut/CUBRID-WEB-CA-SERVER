import { DBInfo } from "../db_info";

export type DBInfoDTO = Omit<DBInfo, "password"> & {isConfigured: boolean}
