import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { HandleCmsClientErrors } from '@decorators/handle-cms-client-errors.decorator';
import { BaseCmsRequest } from '@type/cms-request/base-cms-request';

@Injectable()
export class CmsClientService {

  @HandleCmsClientErrors()
  public async postPublic<T extends Omit<BaseCmsRequest, "token">, P>(url: string, data: T): Promise<P> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: data
    };
    Logger.log(config);
    const response = await axios<P>(config);
    return response.data;
  }

  @HandleCmsClientErrors()
  public async postAuthenticated<T extends BaseCmsRequest, P>(url: string, data: T): Promise<P> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: data
    };
    Logger.log(config);
    const response = await axios<P>(config);
    return response.data;
  }

}
