import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  validate(accesToken: string, refreshToken: string, profile: Profile) {
    console.log('accesToken', accesToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);

    return {
      googleId: profile.id,
      email: profile.emails?.[0].value,
      username: profile.displayName,
    };
  }
}
