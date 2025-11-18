import { BaseCmsResponse } from './BaseCmsResponse';

export type StartInfoCmsResponse = BaseCmsResponse & {
    activelist: Array<{
        active: { dbname: string }[];
    }>;
    dblist: Array<{
        dbs: {
            dbdir: string;
            dbname: string;
        }[];
    }>;
};
