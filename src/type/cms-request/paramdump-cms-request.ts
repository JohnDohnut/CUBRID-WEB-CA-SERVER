import { BaseCmsRequest } from './base-cms-request';

/**
 * CMS request for dumping database parameters.
 * 
 * 데이터베이스 파라미터 덤프를 위한 CMS 요청입니다.
 * 
 * @category Requests
 * @since 1.0.0
 */
export type ParamdumpCmsRequest = BaseCmsRequest & {
    task: 'paramdump';
    dbname: string;
    both: 'n' | 'y';
};

