import os from 'os';

import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  public getHealthInfo() {
    return {
      message: 'Server up and running!',
      hostname: os.hostname(),
      uptimeMs: Math.floor(process.uptime() * 1000),
      startedAt: new Date(Date.now() - process.uptime() * 1000),
    };
  }
}
