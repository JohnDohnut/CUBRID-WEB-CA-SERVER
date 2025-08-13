import { MonitoringHa, MonitoringResource} from '.';

export type User = {
    id: string;
    password: string;

    ha_mon_list: MonitoringHa[];
    resource_mon_list: MonitoringResource[];
}

