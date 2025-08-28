import { HostInfo } from "@root/src/repository/user-repository/type";

export type AddHostRequest = Omit<HostInfo, "uuid">