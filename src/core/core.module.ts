import { Module } from '@nestjs/common';

import { CreateModule } from './create/create.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CreateModule, HealthModule],
})
export class CoreModule {}
