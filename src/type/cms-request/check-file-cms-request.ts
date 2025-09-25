import { BaseCmsRequest } from './base-cms-request';

export type CheckFileCmsRequest = BaseCmsRequest & {
  task: 'check_file';
  path: string;
};
