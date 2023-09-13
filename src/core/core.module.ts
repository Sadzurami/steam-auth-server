import { Module } from '@nestjs/common';

import { CreateModule } from './create/create.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [CreateModule, StatusModule],
})
export class CoreModule {}
