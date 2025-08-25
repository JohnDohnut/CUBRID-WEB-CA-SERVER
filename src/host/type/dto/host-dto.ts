import { HostInfo } from "@repository/user-repository/type";

export type HostDTO = Omit<HostInfo, "password">    