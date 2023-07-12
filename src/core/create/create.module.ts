import { Module } from '@nestjs/common';
import { CreateService } from './create.service';
import { CreateController } from './create.controller';

@Module({
  providers: [CreateService],
  controllers: [CreateController],
})
export class CreateModule {}
