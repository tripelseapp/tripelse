import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(configuration().uri, {}),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

console.log(process.env.CONNECT_STRING);
