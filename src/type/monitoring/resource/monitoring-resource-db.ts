import { MonitoringResource } from "./monitoring-resource";
import { metric_db } from "./monitoring-resource-metrics";

export type MonitoringResourceDB = MonitoringResource<'db'> & {
    dbname: string
} 

