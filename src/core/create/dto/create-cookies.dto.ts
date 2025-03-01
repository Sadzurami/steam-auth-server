import { IsJWT, IsOptional, IsString } from 'class-validator';

export class CreateCookiesDto {
  @IsString()
  @IsJWT()
  refreshToken: string;

  @IsOptional()
  @IsString()
  proxy?: string;
}
