/**
 * Interface representing host information.
 * 
 * Contains host identification and connection details including
 * unique ID, address, port, and password.
 * 
 * @category Types
 * @since 1.0.0
 */
export interface HostInfo {
    uid: string;
    id: string;
    address: string;
    port: number;
    password: string;
}
