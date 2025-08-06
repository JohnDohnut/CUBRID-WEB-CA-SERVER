import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'module-alias/register';
import {getOrCreateSSLCert} from '@util/ssl-util';
import { GlobalExceptionFilter } from './filter/global-filter';

async function bootstrap() {
  const httpsOptions = getOrCreateSSLCert();
  const app = await NestFactory.create(AppModule, {httpsOptions});
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(443);
  console.log("\t@ server running");
}
bootstrap();
