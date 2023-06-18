import { Controller, Get } from '@nestjs/common';

import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/')
  public getHealthInfo() {
    return this.healthService.getHealthInfo();
  }
}
