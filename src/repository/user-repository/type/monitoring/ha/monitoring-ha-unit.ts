import { CmsConnectionInfo } from '../../../../../type/common';
import { MonitoringHaBroker } from './monitoring-ha-broker';
import { MonitoringHaDB } from './monitoring-ha-db';

export * from './monitoring-ha'

export type MonitoringHaUnit = {
    alias : string;
    dbs : MonitoringHaDB [],
    brokers : MonitoringHaBroker[],

} & CmsConnectionInfo

