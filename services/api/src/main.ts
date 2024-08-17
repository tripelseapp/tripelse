import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';
import configuration from './config/config';
import { setupSwagger } from './utils/setupSwagger';
import config from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix(`${config().api.prefix}/${config().api.version}`);

  app.use(cookieParser());
  app.use(
    session({
      secret: configuration().jwt.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  setupSwagger(app);

  const port = config().api.port;
  const prefix = config().api.prefix;

  await app.listen(port, () => {
    console.log(`🚀 Application running at port ${port}`);
    console.log(`🟢 Swagger opened in http://localhost:${port}/${prefix}`);
  });
}
bootstrap();
