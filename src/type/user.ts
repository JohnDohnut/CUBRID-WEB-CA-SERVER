import { MonitoringHA } from "./monitoring/ha/monitoring-ha";
import { MonitoringResource } from "./monitoring/resource/monitoring-resource";

export type User = {
    id: string;
    password: string;

    ha_mon_list: MonitoringHA[];
    resource_mon_list: MonitoringResource[];
}

