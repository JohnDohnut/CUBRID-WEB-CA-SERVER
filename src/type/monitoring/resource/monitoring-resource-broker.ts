import { MonitoringResource } from "./monitoring-resource";
import { metric_broker, MetricByType } from "./monitoring-resource-metrics";

export type MonitoringResourceBroker = MonitoringResource<'broker'> & {
    bname: string
} 
