/**
 * Request interface for adding a new host.
 * 
 * Contains the host identification information including ID, address,
 * port, and password for connection.
 * 
 * @category Requests
 * @since 1.0.0
 */
export interface AddHostRequest {
    id: string;
    address: string;
    port: number;
    password: string;
}
