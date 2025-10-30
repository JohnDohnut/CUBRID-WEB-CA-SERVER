import { BaseCmsResponse } from './BaseCmsResponse';

export type StartInfoCmsResponse = BaseCmsResponse & {
    activelist: {
        active: { dbname: string }[];
    };
    dblist: {
        dbs: {
            dbdir: string;
            dbname: string;
        }[];
    };
};
