import { IsJWT, IsOptional, IsString } from 'class-validator';

export class CreateAccessTokenDto {
  @IsString()
  @IsJWT()
  refreshToken: string;

  @IsOptional()
  @IsString()
  proxy?: string;
}
