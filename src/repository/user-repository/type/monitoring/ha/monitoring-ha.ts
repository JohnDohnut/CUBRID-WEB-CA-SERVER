import { MonitoringHaUnit } from "./monitoring-ha-unit";
export type MonitoringHa = {
    uuid: string;
    name: string;
    mons: MonitoringHaUnit[];
};