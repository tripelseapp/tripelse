import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRoot(
      'mongodb://tripelseapp:LNUBCdyDhvPgDfWO@mongodb:27017/tripelse?authSource=admin',
      {
        auth: {
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASS,
        },
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        dbName: 'tripelse',
      },
    ),

    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
