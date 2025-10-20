import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'module-alias/register';
import { getOrCreateSSLCert } from '@util/ssl-util';
import { GlobalExceptionFilter } from '@error/global-filter';
import { ConfigService } from '@config/config.service';

async function bootstrap() {
    const httpsOptions = getOrCreateSSLCert();
    const app = await NestFactory.create(AppModule, { httpsOptions });
    const configService = app.get(ConfigService);
    const port: string = configService.getPort();
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.listen(port);
    console.log('\t@ server running port :', port);
}
bootstrap();
