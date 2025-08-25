import { AddressInfo } from "../../../type/common";

export type DBInfo = {
    uid : string;
    dbname : string;
    dbuser : string;
    dbpassword : string;
    targetId : string;
} & AddressInfo