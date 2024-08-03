import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { TypedEventEmitterModule } from 'event-emitter/event-emitter.module';
import { MailModule } from 'mail/mail.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TemporalTokenModule } from './temporal-token/temporal-token.module';
import { TripModule } from './trip/trip.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(configuration().uri, {}),
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
