import { HostInfo } from "../host-info";

export type HostDTO = Omit<HostInfo, "password">
