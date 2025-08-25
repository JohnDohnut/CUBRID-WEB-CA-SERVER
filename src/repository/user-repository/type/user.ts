import { MonitoringHa, MonitoringResource} from './monitoring';
import { HostInfo } from './host_info';

export type User = {
    uuid : string;
    id: string;
    password: string;

    host_list : HostInfo[];

    ha_mon_list: MonitoringHa[];
    resource_mon_list: MonitoringResource[];
}

