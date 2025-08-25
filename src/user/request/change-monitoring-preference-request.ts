import { MonitoringHa, MonitoringResource } from "@repository/user-repository/type"

export type ChangeMonitoringPreferenceRequest = {
    ha_mon_list : MonitoringHa[];
    resource_mon_list : MonitoringResource[];
}