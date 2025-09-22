import { DBInfo } from './db-info';
import { HostInfo } from './host-info';

export interface User {
    uuid: string;
    id: string;
    password: string;
    department : string;
    host_list: { [uid: string]: HostInfo };
    ha_mon_list: { [uid: string]: any };
    resource_mon_list: { [uid: string]: any };
}
