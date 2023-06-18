import pEvent from 'p-event';
import { EAuthTokenPlatformType, LoginSession } from 'steam-session';

import { Injectable, Logger } from '@nestjs/common';

import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { CreateCookiesDto } from './dto/create-cookies.dto';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';

@Injectable()
export class CreateService {
  private readonly logger = new Logger(CreateService.name);

  public async createRefreshToken(dto: CreateRefreshTokenDto) {
    let session: LoginSession;

    try {
      const { username, password, guardCode, platform, proxy } = dto;

      const credentials = { accountName: username, password } as any;
      if (guardCode) credentials.steamGuardCode = guardCode;

      session = this.createSessionInstance({ platform, proxy });

      const { actionRequired } = await session.startWithCredentials(credentials);
      if (actionRequired) throw new Error('Guard action required');

      await pEvent(session, 'authenticated', { rejectionEvents: ['error', 'timeout'] });
      const refreshToken = session.refreshToken;

      return refreshToken;
    } catch (error) {
      throw new Error('Failed to create refresh token');
    } finally {
      if (session) session.cancelLoginAttempt();
    }
  }

  public async createAccessToken(dto: CreateAccessTokenDto) {
    let session: LoginSession;

    try {
      const { refreshToken, platform, proxy } = dto;

      session = this.createSessionInstance({ platform, proxy });
      session.refreshToken = refreshToken;

      await session.refreshAccessToken();
      const accessToken = session.accessToken;

      return accessToken;
    } catch (error) {
      throw new Error('Failed to create access token');
    } finally {
      if (session) session.cancelLoginAttempt();
    }
  }

  public async createCookies(dto: CreateCookiesDto) {
    let session: LoginSession;

    try {
      const { refreshToken, proxy } = dto;

      session = this.createSessionInstance({ proxy });
      session.refreshToken = refreshToken;

      const cookies = await session.getWebCookies();

      return cookies.join('; ');
    } catch (error) {
      throw new Error('Failed to create cookies');
    }
  }

  private createSessionInstance(options: { platform?: string; proxy?: string }) {
    try {
      let sessionPlatformType: EAuthTokenPlatformType;

      if (options.platform === 'desktop') sessionPlatformType = EAuthTokenPlatformType.SteamClient;
      else if (options.platform === 'mobile') sessionPlatformType = EAuthTokenPlatformType.MobileApp;
      else sessionPlatformType = EAuthTokenPlatformType.WebBrowser;

      const sessionOptions = {} as any;
      if (options.proxy) {
        const proxyType = options.proxy.startsWith('socks') ? 'socksProxy' : 'httpProxy';
        sessionOptions[proxyType] = options.proxy;
      }

      const session = new LoginSession(sessionPlatformType, sessionOptions);
      session.loginTimeout = 35000;

      return session;
    } catch (error) {
      throw new Error('Failed to create session instance');
    }
  }
}
