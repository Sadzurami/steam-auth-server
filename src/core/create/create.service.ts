import pEvent from 'p-event';
import { EAuthTokenPlatformType, LoginSession } from 'steam-session';

import { Injectable } from '@nestjs/common';

import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { CreateCookiesDto } from './dto/create-cookies.dto';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import {
  ConstructorOptions as LoginSessionOptions,
  StartLoginSessionWithCredentialsDetails as LoginSessionCredentials,
} from 'steam-session/dist/interfaces-external';
import { getAuthCode } from 'steam-totp';
import { TokensPlatform } from './enums/tokens-platfrom.enum';

@Injectable()
export class CreateService {
  public async createRefreshToken(dto: CreateRefreshTokenDto) {
    const { username, password, sharedSecret, guardCode, platform, proxy } = dto;

    const loginSession = this.createSessionInstance({ platform, proxy });
    loginSession.on('error', () => {}); // fallback

    try {
      const credentials = { accountName: username, password } as LoginSessionCredentials;
      if (guardCode) credentials.steamGuardCode = guardCode;
      if (sharedSecret) credentials.steamGuardCode = getAuthCode(sharedSecret);

      loginSession
        .startWithCredentials(credentials)
        .then((result) => result.actionRequired && loginSession.emit('error', new Error('Guard action required')))
        .catch((error) => loginSession.emit('error', error));

      await pEvent(loginSession, 'authenticated', { rejectionEvents: ['error', 'timeout'], timeout: 35000 });

      const refreshToken = loginSession.refreshToken;
      if (!refreshToken) throw new Error('Refresh token is empty');

      return refreshToken;
    } catch (error) {
      throw new Error('Failed to create refresh token');
    } finally {
      loginSession.cancelLoginAttempt();
    }
  }

  public async createAccessToken(dto: CreateAccessTokenDto) {
    const { refreshToken, proxy } = dto;

    const decodedRefreshToken = this.decodeRefreshToken(refreshToken);

    let platform: TokensPlatform;
    if (decodedRefreshToken.aud.includes('client')) {
      platform = TokensPlatform.desktop;
    } else if (decodedRefreshToken.aud.includes('mobile')) {
      platform = TokensPlatform.mobile;
    } else if (decodedRefreshToken.aud.includes('web')) {
      platform = TokensPlatform.web;
    } else {
      throw new Error('Unknown token platform type');
    }

    const loginSession = this.createSessionInstance({ platform, proxy });
    loginSession.refreshToken = refreshToken;

    try {
      await loginSession.refreshAccessToken();

      const accessToken = loginSession.accessToken;
      if (!accessToken) throw new Error('Access token is empty');

      return accessToken;
    } catch (error) {
      throw new Error('Failed to create access token');
    }
  }

  public async createCookies(dto: CreateCookiesDto) {
    const { refreshToken, proxy } = dto;

    const decodedRefreshToken = this.decodeRefreshToken(refreshToken);

    let platform: TokensPlatform;
    if (decodedRefreshToken.aud.includes('client')) {
      platform = TokensPlatform.desktop;
    } else if (decodedRefreshToken.aud.includes('mobile')) {
      platform = TokensPlatform.mobile;
    } else if (decodedRefreshToken.aud.includes('web')) {
      platform = TokensPlatform.web;
    } else {
      throw new Error('Unknown token platform type');
    }

    const loginSession = this.createSessionInstance({ proxy, platform });
    loginSession.refreshToken = refreshToken;

    try {
      const cookies = await loginSession.getWebCookies();

      return cookies.join('; ');
    } catch (error) {
      throw new Error('Failed to create cookies');
    }
  }

  private createSessionInstance(options: { platform?: TokensPlatform; proxy?: string }) {
    try {
      let sessionPlatformType: EAuthTokenPlatformType;

      if (options.platform === 'desktop') sessionPlatformType = EAuthTokenPlatformType.SteamClient;
      else if (options.platform === 'mobile') sessionPlatformType = EAuthTokenPlatformType.MobileApp;
      else if (options.platform === 'web') sessionPlatformType = EAuthTokenPlatformType.WebBrowser;
      else throw new Error('Invalid platform type');

      const sessionOptions = {} as LoginSessionOptions;
      if (options.proxy) {
        const proxyType = options.proxy.startsWith('socks') ? 'socksProxy' : 'httpProxy';
        sessionOptions[proxyType] = options.proxy;
      }

      const loginSession = new LoginSession(sessionPlatformType, sessionOptions);
      loginSession.loginTimeout = 30000;

      return loginSession;
    } catch (error) {
      throw new Error('Failed to create loginSession instance');
    }
  }

  private decodeRefreshToken(token: string) {
    const parts = token.split('.');
    if (parts.length != 3) throw new Error('Invalid token');

    const standardBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');

    return JSON.parse(Buffer.from(standardBase64, 'base64').toString('utf8'));
  }
}
