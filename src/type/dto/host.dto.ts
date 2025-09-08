import { HostInfo } from "../host_info";

export type HostDTO = Omit<HostInfo, "password">
