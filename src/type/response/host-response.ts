import { HostInfo } from '../host-info';

/**
 * Response interface for single host information.
 * 
 * Contains host information without password for security.
 * Used when returning individual host data to client.
 * 
 * @category Responses
 * @since 1.0.0
 */
export type HostResponse = Omit<HostInfo, "password">;
