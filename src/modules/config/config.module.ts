import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [NestConfigModule.forRoot({ cache: true, isGlobal: true })],
})
export class ConfigModule {}
