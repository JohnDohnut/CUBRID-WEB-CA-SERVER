import { DBInfo } from './db-info';
import { HostInfo } from './host-info';

/**
 * User interface representing a user in the system.
 * 
 * Contains user information including authentication details,
 * department, and associated host lists.
 * 
 * @category Types
 * @since 1.0.0
 */
export interface User {
    uuid: string;
    id: string;
    password: string;
    department : string;
    host_list: { [uid: string]: HostInfo };
    ha_mon_list: { [uid: string]: any };
    resource_mon_list: { [uid: string]: any };
}
