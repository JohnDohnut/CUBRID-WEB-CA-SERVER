import { MonitoringResource } from "./monitoring-resource";

export type MonitoringResourceVol = MonitoringResource<'vol'> & {
    dbname: string;
    volPath: string;
} 