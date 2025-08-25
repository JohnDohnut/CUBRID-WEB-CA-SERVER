import { DBInfo } from "@repository/user-repository/type";

export type DBInfoDTO = Omit<DBInfo, "password"> & {isConfigured : boolean}