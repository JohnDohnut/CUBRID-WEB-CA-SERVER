import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HandleCmsClientErrors } from '@decorators/handle-cms-client-errors.decorator';
import { BaseCmsRequest } from '@type/index';
import * as https from 'https';

@Injectable()
export class CmsClientService {

  constructor(private readonly httpService: HttpService) {}

  @HandleCmsClientErrors()
  public async postPublic<T extends Omit<BaseCmsRequest, "token">, P>(url: string, data: T): Promise<P> {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    };
    Logger.log({ url, data, config });
    const response = await firstValueFrom(
      this.httpService.post<P>(url, data, config)
    );
    return response.data;
  }

  @HandleCmsClientErrors()
  public async postAuthenticated<T extends BaseCmsRequest, P>(url: string, data: T): Promise<P> {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    };
    Logger.log({ url, data, config });
    const response = await firstValueFrom(
      this.httpService.post<P>(url, data, config)
    );
    return response.data;
  }

}
