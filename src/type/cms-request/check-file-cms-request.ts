import { BaseCmsRequest } from './base-cms-request';

export type CheckFileCmsRequest = BaseCmsRequest & {
    task: 'checkfile';
};
