import { CmsConnectionInfo } from "../../../type/common";
import { DBInfo } from "./db_info";

export type HostInfo = CmsConnectionInfo & {

    uid: string;
    alias: string;
    save_password: boolean;
    auto_commit: boolean;
    set_timeout: boolean;
    timeout: number;
    db_list : DBInfo[];

}