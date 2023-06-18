import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          level: 'trace',
          transport: {
            target: configService.get<string>('NODE_ENV') === 'production' ? 'pino/file' : 'pino-pretty',
          },
        },
      }),
    }),
  ],
})
export class LoggerModule {}
