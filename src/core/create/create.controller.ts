import { BadRequestException, Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateService } from './create.service';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { CreateCookiesDto } from './dto/create-cookies.dto';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';

@Controller('create')
export class CreateController {
  constructor(private readonly createService: CreateService) {}

  @Post('refresh-token')
  @UsePipes(ValidationPipe)
  public async createRefreshToken(@Body() dto: CreateRefreshTokenDto) {
    try {
      return await this.createService.createRefreshToken(dto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('access-token')
  @UsePipes(ValidationPipe)
  public async createAccessToken(@Body() dto: CreateAccessTokenDto) {
    try {
      return await this.createService.createAccessToken(dto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('cookies')
  @UsePipes(ValidationPipe)
  public async createCookies(@Body() dto: CreateCookiesDto) {
    try {
      return await this.createService.createCookies(dto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
