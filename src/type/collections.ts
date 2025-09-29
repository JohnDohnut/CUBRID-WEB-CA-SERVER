import { HostInfo } from './host-info';
import { DBInfo } from './db-info';

/**
 * Generic hashmap/dictionary type
 * 
 * @category Types
 * @since 1.0.0
 */
export type HashMap<T> = Record<string, T>;

/**
 * Host list as a hashmap (internal use with passwords)
 */
export type HostList = HashMap<HostInfo>;

/**
 * Safe host list without password fields (for API responses)
 */
export type SafeHostList = HashMap<Omit<HostInfo, "password">>;

/**
 * Database list as a hashmap (internal use with passwords)
 */
export type DbList = HashMap<DBInfo>;

/**
 * Safe database list without password fields (for API responses)
 */
export type SafeDbList = HashMap<Omit<DBInfo, "password">>;

// Re-export commonly used types
export type { HostInfo } from './host-info';
export type { DBInfo } from './db-info';
export type { User } from './user';
