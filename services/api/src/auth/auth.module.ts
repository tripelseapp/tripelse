import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './utils/serializer.util';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { TemporalTokenModule } from 'temporal-token/temporal-token.module';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { ResetPasswordService } from './services/reset-password.service';

@Module({
  imports: [
    UserModule,
    TemporalTokenModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiration },
    }),
  ],
  controllers: [AuthController, ResetPasswordController],
  providers: [
    AuthService,
    ResetPasswordService,
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
