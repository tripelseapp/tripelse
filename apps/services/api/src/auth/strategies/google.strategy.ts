import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { UserFromProvider } from 'auth/types/User-from-google.type';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import config from 'config/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: config().email.client,
      clientSecret: config().email.secret,
      callbackURL: config().email.callbackUrl,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile) {
      throw new Error('Google profile is required');
    }
    const { name, emails, photos, displayName } = profile;

    const email = emails?.[0].value;
    if (!email) {
      throw new Error('Google profile email is required');
    }
    const googleUser: UserFromProvider = {
      email,
      providerName: profile.provider,
      providerId: profile.id,
      username: displayName,
      avatar: photos?.[0].value ?? null,
      familyName: name?.familyName ?? null,
      givenName: name?.givenName ?? null,
    };

    const userDetails = await this.authService.validateGoogleUser(googleUser);

    done(null, userDetails);
  }
}
