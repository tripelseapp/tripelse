import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TripsModule } from './trips/trips.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(process.env.CONNECT_STRING, {}),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    TripsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

console.log(process.env.CONNECT_STRING);
