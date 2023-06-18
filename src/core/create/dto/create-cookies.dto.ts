import { IsJWT, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCookiesDto {
  @IsString()
  @IsJWT()
  refreshToken: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  proxy?: string;
}
