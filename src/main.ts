import { Logger } from 'nestjs-pino';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ErrorFilter } from './filters/error.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableShutdownHooks();

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new ErrorFilter());

  const config = app.get(ConfigService);

  await app.listen(config.get('PORT') || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
