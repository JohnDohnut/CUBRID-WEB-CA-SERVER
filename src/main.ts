import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'module-alias/register';
import { getOrCreateSSLCert } from '@util/ssl-util';
import { GlobalExceptionFilter } from '@error/global-filter';
import { ConfigService } from '@config/config.service';
import { SuccessResponseInterceptor, LoggingInterceptor } from '@common'; // Updated import

async function bootstrap() {
    const httpsOptions = getOrCreateSSLCert();
    const app = await NestFactory.create(AppModule, { httpsOptions });
    const configService = app.get(ConfigService);
    const port: string = configService.getPort();
    
    // CORS 설정 - 환경별로 다르게 적용
    const allowedOrigins = configService.getAllowedOrigins();
    
    if (allowedOrigins.includes('*')) {
        // 개발 환경 - 모든 origin 허용
        app.enableCors({
            origin: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
            credentials: true,
        });
    } else {
        // 내부 툴용 - 내부 네트워크 허용
        app.enableCors({
            origin: (origin, callback) => {
                // origin이 없거나 내부 네트워크인 경우 허용
                if (!origin) {
                    return callback(null, true);
                }
                
                // 내부 네트워크 IP 대역 체크
                const isInternalNetwork = 
                    origin.startsWith('http://localhost') ||
                    origin.startsWith('http://127.0.0.1') ||
                    origin.startsWith('http://192.168.') ||
                    origin.startsWith('http://10.') ||
                    origin.startsWith('http://172.16.') ||
                    origin.startsWith('http://172.17.') ||
                    origin.startsWith('http://172.18.') ||
                    origin.startsWith('http://172.19.') ||
                    origin.startsWith('http://172.20.') ||
                    origin.startsWith('http://172.21.') ||
                    origin.startsWith('http://172.22.') ||
                    origin.startsWith('http://172.23.') ||
                    origin.startsWith('http://172.24.') ||
                    origin.startsWith('http://172.25.') ||
                    origin.startsWith('http://172.26.') ||
                    origin.startsWith('http://172.27.') ||
                    origin.startsWith('http://172.28.') ||
                    origin.startsWith('http://172.29.') ||
                    origin.startsWith('http://172.30.') ||
                    origin.startsWith('http://172.31.');
                
                if (isInternalNetwork) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS - Internal tool only'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
            credentials: true,
        });
    }
    
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(
        new LoggingInterceptor(), // Registered first
        new SuccessResponseInterceptor() // Registered second
    );
    await app.listen(port);
    console.log('\t@ server running port :', port);
}
bootstrap();
