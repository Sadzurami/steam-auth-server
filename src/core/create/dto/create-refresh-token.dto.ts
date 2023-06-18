import { IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

import { TokensPlatform } from '../enums/tokens-platfrom.enum';

export class CreateRefreshTokenDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  password: string;

  @IsString()
  @IsEnum(TokensPlatform)
  platform: TokensPlatform;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  guardCode?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  proxy?: string;
}
