import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './utils/serializer.util';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { TemporalTokenModule } from 'temporal-token/temporal-token.module';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { ResetPasswordService } from './services/reset-password.service';
import { ValidateEmailController } from './controllers/verify-email.controller';
import config from 'config/config';
import { ValidateUserService } from './services/validate-user.service';

@Module({
  imports: [
    UserModule,
    TemporalTokenModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      global: true,
      secret: config().jwt.secret,
      signOptions: { expiresIn: config().jwt.expiration },
    }),
  ],
  controllers: [
    AuthController,
    ResetPasswordController,
    ValidateEmailController,
  ],
  providers: [
    AuthService,
    ResetPasswordService,
    ValidateUserService,
    GoogleStrategy,
    JwtStrategy,
    SessionSerializer,
    LocalStrategy,
    RefreshJwtStrategy,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
