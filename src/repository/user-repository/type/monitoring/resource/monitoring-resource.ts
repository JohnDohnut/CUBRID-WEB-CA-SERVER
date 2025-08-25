import { AddressInfo } from "@type/common/address-info"
import { MetricByType } from "./monitoring-resource-metrics";

export type MonitoringResource<T extends keyof MetricByType = keyof MetricByType> = {
    cms: AddressInfo;
    metric: MetricByType[T];
    type: T;
    interval: string;
} 

