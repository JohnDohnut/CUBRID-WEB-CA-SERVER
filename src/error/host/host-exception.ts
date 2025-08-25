export enum HostErrorCode{
    DUPLICATED_HOST = "DUPLICATED_HOST",
    MAX_HOSTS = "MAX_HOSTS"
}

export class HostException extends Error {
    constructor(
      public readonly code: HostErrorCode,
      message?: string,
    ) {
      super(message ?? code);
      this.name = 'HostException';
    }
  }