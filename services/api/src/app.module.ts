import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TripModule } from './trip/trip.module';
import { UserModule } from './user/user.module';
import { MailModule } from 'mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypedEventEmitterModule } from 'event-emitter/event-emitter.module';
import { TemporalTokenModule } from './temporal-token/temporal-token.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(configuration().uri, {}),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    TripModule,
    AuthModule,
    MailModule,
    EventEmitterModule.forRoot(),
    TypedEventEmitterModule,
    TemporalTokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
