import { CmsError } from '@error/cms/cms-error';
import { AppError } from '@error/app-error';
import axios from 'axios';
import { Logger } from '@nestjs/common';

export function HandleCmsClientErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }

        if (axios.isAxiosError(error)) {
          if (error.response) {
            throw CmsError.RequestFailed({ 
              status: error.response.status, 
              data: error.response.data 
            }, error);
          } else if (error.request) {
            Logger.log(error.request);
            throw CmsError.NoResponse(undefined, error);
          }
        }
        throw CmsError.Unknown({ message: error.message }, error);
      }
    };

    return descriptor;
  };
}
