import { MonitoringResource } from "./monitoring-resource";
import { metric_broker } from "./monitoring-resource-metrics";

export type MonitoringResourceBroker = MonitoringResource<metric_broker> & {
    bname: string
} 
