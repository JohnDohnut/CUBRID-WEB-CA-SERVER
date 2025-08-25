import { MonitoringResource } from "./monitoring-resource";

export type MonitoringResourceDB = MonitoringResource<'db'> & {
    dbname: string
} 

