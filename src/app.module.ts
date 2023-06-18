import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule, CoreModule],
})
export class AppModule {}
