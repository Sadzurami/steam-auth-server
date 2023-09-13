import os from 'os';

import { Controller, Get } from '@nestjs/common';

@Controller('status')
export class StatusController {
  @Get('/')
  public getStatus() {
    return {
      host: os.hostname(),
      uptime: Math.floor(process.uptime() * 1000),
      message: 'Server up and running!',
    };
  }
}
