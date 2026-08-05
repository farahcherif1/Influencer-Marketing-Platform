import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
  Profile,
} from 'passport-google-oauth20';
import googleOauthConfig from '../../../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { GoogleUserPayload } from '../../../types/express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
      prompt: 'consent', // or 'select_account'
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<GoogleUserPayload> {
    const email = profile.emails?.[0]?.value || '';
    const firstName = profile.name?.givenName || '';
    const lastName = profile.name?.familyName || '';
    const avatarUrl = profile.photos?.[0]?.value || '';

    return {
      email,
      name: `${firstName} ${lastName}`,
      avatarUrl,
    };
  }
}
