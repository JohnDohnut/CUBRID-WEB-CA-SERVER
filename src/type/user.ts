import { HostInfo } from './host-info';

export interface User {
    uuid: string;
    id: string;
    password: string;
    host_list: HostInfo[];
    ha_mon_list: any[];
    resource_mon_list: any[];
}
