import { IsJWT, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAccessTokenDto {
  @IsString()
  @IsJWT()
  refreshToken: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  proxy?: string;
}
