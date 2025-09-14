import { DBInfo } from './db-info';
import { HostInfo } from './host-info';

export interface User {
    uuid: string;
    id: string;
    password: string;
    host_list: HostInfo[];
    db_list : DBInfo[];
    ha_mon_list: any[];
    resource_mon_list: any[];
}
