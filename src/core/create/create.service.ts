import { EAuthTokenPlatformType, LoginSession } from 'steam-session';
import {
  ConstructorOptions as LoginSessionOptions,
  StartLoginSessionWithCredentialsDetails as LoginSessionCredentials,
} from 'steam-session/dist/interfaces-external';
import SteamTotp from 'steam-totp';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { CreateCookiesDto } from './dto/create-cookies.dto';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { TokensPlatform } from './enums/tokens-platfrom.enum';
import { createMachineName } from './helpers';

@Injectable()
export class CreateService {
  constructor(private readonly config: ConfigService) {}

  public async createRefreshToken(dto: CreateRefreshTokenDto) {
    const { username, password, sharedSecret, guardCode, platform, proxy } = dto;

    if (!proxy && this.config.get('STRICT_PROXY') === 'true') throw new Error('Proxy is required');

    const session = this.createSession({ identifier: username, platform, proxy });
    session.on('error', () => {});

    const credentials: LoginSessionCredentials = { accountName: username, password };
    if (guardCode) credentials.steamGuardCode = guardCode;
    if (sharedSecret) credentials.steamGuardCode = SteamTotp.getAuthCode(sharedSecret);

    return await new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        session.cancelLoginAttempt();

        reject(new Error('Session timed out'));
      }, 35000);

      session.once('authenticated', () => {
        session.cancelLoginAttempt();
        clearTimeout(timeout);

        resolve(session.refreshToken);
      });

      session.once('error', (error) => {
        session.cancelLoginAttempt();
        clearTimeout(timeout);

        reject(new Error('Session error', { cause: error }));
      });

      session.once('timeout', () => {
        session.cancelLoginAttempt();
        clearTimeout(timeout);

        reject(new Error('Session timed out'));
      });

      session
        .startWithCredentials(credentials)
        .then((result) => {
          if (!result.actionRequired) return;

          session.cancelLoginAttempt();
          clearTimeout(timeout);

          reject(new Error('Session requires guard action'));
        })
        .catch((error) => reject(error));
    });
  }

  public async createAccessToken(dto: CreateAccessTokenDto) {
    const { refreshToken, proxy } = dto;

    if (!proxy && this.config.get('STRICT_PROXY') === 'true') throw new Error('Proxy is required');

    const { aud } = this.decodeRefreshToken(refreshToken);

    let platform: TokensPlatform;
    if (aud.includes('client')) platform = TokensPlatform.desktop;
    else if (aud.includes('mobile')) platform = TokensPlatform.mobile;
    else if (aud.includes('web')) platform = TokensPlatform.web;
    else throw new Error('Unknown token platform type');

    const session = this.createSession({ platform, proxy });
    session.refreshToken = refreshToken;

    return await session.refreshAccessToken().then(() => session.accessToken);
  }

  public async createCookies(dto: CreateCookiesDto) {
    const { refreshToken, proxy } = dto;

    if (!proxy && this.config.get('STRICT_PROXY') === 'true') throw new Error('Proxy is required');

    const { aud } = this.decodeRefreshToken(refreshToken);

    let platform: TokensPlatform;
    if (aud.includes('client')) platform = TokensPlatform.desktop;
    else if (aud.includes('mobile')) platform = TokensPlatform.mobile;
    else if (aud.includes('web')) platform = TokensPlatform.web;
    else throw new Error('Unknown token platform type');

    const session = this.createSession({ platform, proxy });
    session.refreshToken = refreshToken;

    return await session.getWebCookies();
  }

  private createSession(options: { identifier?: string; platform?: TokensPlatform; proxy?: string }) {
    const { identifier, platform = TokensPlatform.web, proxy } = options;

    const sessionOptions: LoginSessionOptions = {};

    let platformType: EAuthTokenPlatformType;
    switch (platform) {
      case TokensPlatform.web:
        platformType = EAuthTokenPlatformType.WebBrowser;
        break;
      case TokensPlatform.mobile:
        platformType = EAuthTokenPlatformType.MobileApp;
        break;
      case TokensPlatform.desktop:
        platformType = EAuthTokenPlatformType.SteamClient;
        sessionOptions.machineId = true;
        sessionOptions.machineFriendlyName = createMachineName(identifier);
        break;
    }

    if (proxy) {
      const proxyType = proxy.startsWith('socks') ? 'socksProxy' : 'httpProxy';
      sessionOptions[proxyType] = proxy;
    }

    const session = new LoginSession(platformType, sessionOptions);
    session.loginTimeout = 30000;

    return session;
  }

  private decodeRefreshToken(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Token must have 3 parts');

      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payloadJson = JSON.parse(payloadString);

      return payloadJson;
    } catch (error) {
      throw new Error('Failed to decode refresh token', { cause: error });
    }
  }
}
