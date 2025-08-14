import { MonitoringHaUnit } from "./monitoring-ha-unit";

export type MonitoringHa = {
    name: string;
    mons : MonitoringHaUnit[];
};