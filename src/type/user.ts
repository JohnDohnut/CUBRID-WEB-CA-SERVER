import { MonitoringHA } from "./monitoring/ha/monitoring-ha";
import { MonitoringResource } from "./monitoring/resource/monitoring-resource";

export type User <T extends MonitoringHA, P extends MonitoringResource> = {
    id: string;
    password: string;

    ha_mon_list: T[];
    resource_mon_list: P[];
}

