import { HostInfo } from '../host-info';

/**
 * Request type for updating a host.
 * Contains host information including UID.
 * 
 * 호스트 업데이트를 위한 요청 타입입니다.
 * UID를 포함한 호스트 정보를 포함합니다.
 * 
 * @category Requests
 * @since 1.0.0
 */
export type UpdateHostClientRequest = HostInfo;
