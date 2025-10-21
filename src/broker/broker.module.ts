import { Module } from '@nestjs/common';
import { BrokerController } from './broker.controller';
import { BrokerService } from './broker.service';

/**
 * Module for managing broker-related functionalities.
 * Currently a placeholder.
 *
 * 브로커 관련 기능을 관리하기 위한 모듈입니다.
 * 현재는 플레이스홀더입니다.
 *
 * @category Modules
 * @since 1.0.0
 */
@Module({
    controllers: [BrokerController],
    providers: [BrokerService],
})
export class BrokerModule {}
