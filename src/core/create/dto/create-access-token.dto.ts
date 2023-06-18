import { IsEnum, IsJWT, IsOptional, IsString, IsUrl } from 'class-validator';

import { TokensPlatform } from '../enums/tokens-platfrom.enum';

export class CreateAccessTokenDto {
  @IsString()
  @IsJWT()
  refreshToken: string;

  @IsString()
  @IsEnum(TokensPlatform)
  platform: TokensPlatform;

  @IsOptional()
  @IsString()
  @IsUrl()
  proxy?: string;
}
