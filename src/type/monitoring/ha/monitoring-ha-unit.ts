import { AddressInfo } from "@type/common/address-info";
import { MonitoringHABroker } from "./monitoring-ha-broker";
import { MonitoringHADB } from "./monitoring-ha-db";

export type MonitoringHAUnit = {
    cms: AddressInfo & {id: string, password: string};
    mon_db_list: MonitoringHADB[];
    mon_broker_list: MonitoringHABroker[];
} 