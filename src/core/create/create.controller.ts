import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateService } from './create.service';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { CreateCookiesDto } from './dto/create-cookies.dto';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';

@Controller('create')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post('refresh-token')
  @UsePipes(ValidationPipe)
  public createRefreshToken(@Body() dto: CreateRefreshTokenDto) {
    return this.createService.createRefreshToken(dto);
  }

  @Post('access-token')
  @UsePipes(ValidationPipe)
  public createAccessToken(@Body() dto: CreateAccessTokenDto) {
    return this.createService.createAccessToken(dto);
  }

  @Post('cookies')
  @UsePipes(ValidationPipe)
  public createCookies(@Body() dto: CreateCookiesDto) {
    return this.createService.createCookies(dto);
  }
}
