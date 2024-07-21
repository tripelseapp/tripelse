import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(_accesToken: string, _refreshToken: string, profile: Profile) {
    if (!profile) {
      throw new Error('Google profile is required');
    }

    const email = profile.emails?.[0].value;
    if (!email) {
      throw new Error('Google profile email is required');
    }

    const userDetails = await this.authService.validateUser({
      email,
      id: profile.id,
      username: profile.displayName,
      avatar: profile.photos?.[0].value ?? null,
    });
    console.log('userDetails', userDetails);
    return userDetails || null;
  }
}
