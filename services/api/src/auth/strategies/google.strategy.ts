import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile) {
      throw new Error('Google profile is required');
    }
    const { name, emails, photos } = profile;

    const email = profile.emails?.[0].value;
    if (!email) {
      throw new Error('Google profile email is required');
    }

    const userDetails = await this.authService.validateGoogleUser({
      email,
      id: profile.id,
      username: profile.displayName,
      avatar: profile.photos?.[0].value ?? null,
    });
    console.log('userDetails', userDetails);

    done(null, userDetails);
  }
}
