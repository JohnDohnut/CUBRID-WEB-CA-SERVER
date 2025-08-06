import { AddressInfo } from "@type/common/address-info"
import { AllMetrics as AllMonitoringMetrics } from "./monitoring-resource-metrics";

export type MonitoringResource<T = AllMonitoringMetrics> = {
    cms: AddressInfo;
    metric: T;
    type: string;
    interval: string;
} 

