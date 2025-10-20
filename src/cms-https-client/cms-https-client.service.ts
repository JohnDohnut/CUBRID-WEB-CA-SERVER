import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HandleCmsHttpsClientErrors } from '@decorators/handle-cms-https-client-errors.decorator';
import { BaseCmsRequest } from '@type/index';
import * as https from 'https';

@Injectable()
export class CmsHttpsClientService {
    constructor(private readonly httpService: HttpService) {}

    @HandleCmsHttpsClientErrors()
    public async postPublic<T extends Omit<BaseCmsRequest, 'token'>, P>(
        url: string,
        data: T,
    ): Promise<P> {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        };
        Logger.log({ url, data, config });
        const response = await firstValueFrom(
            this.httpService.post<P>(url, data, config),
        );
        return response.data;
    }

    @HandleCmsHttpsClientErrors()
    public async postAuthenticated<T extends BaseCmsRequest, P>(
        url: string,
        data: T,
    ): Promise<P> {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        };
        Logger.log({ url, data, config });
        const response = await firstValueFrom(
            this.httpService.post<P>(url, data, config),
        );
        return response.data;
    }
}
