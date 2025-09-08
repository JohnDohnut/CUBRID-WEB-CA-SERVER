import { DBInfo } from "../db-info";

export type DBInfoDTO = Omit<DBInfo, "password"> & {isConfigured: boolean}
