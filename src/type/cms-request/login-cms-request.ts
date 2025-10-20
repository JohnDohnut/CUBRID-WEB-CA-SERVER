import { BaseCmsRequest } from './base-cms-request';

export type LoginCmsRequest = Omit<BaseCmsRequest, 'token'> & {
    host?: string;
    port?: string;
    id: string;
    password: string;
    clientver?: string;
};
