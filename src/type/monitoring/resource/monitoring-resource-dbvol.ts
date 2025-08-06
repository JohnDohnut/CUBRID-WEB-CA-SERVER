import { MonitoringResource } from "./monitoring-resource";
import { metric_vol } from "./monitoring-resource-metrics";

export type MonitoringResourceVol = MonitoringResource<metric_vol> & {
    dbname: string;
    volPath: string;
} 