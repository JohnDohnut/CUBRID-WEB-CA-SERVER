import { User } from "./user";

export type UserMonitoring = Pick<User, 'ha_mon_list' | 'resource_mon_list'>