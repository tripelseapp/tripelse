import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { constants } from 'constants/constants';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { setupSwagger } from './utils/setupSwagger';

const PORT = configuration().port;
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
  app.setGlobalPrefix(`${constants.api.prefix}/${constants.api.version}`);

  app.use(cookieParser());
  app.use(
    session({
      secret: configuration().jwtSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  setupSwagger(app);

  await app.listen(PORT, () => {
    console.log(`🚀 Application running at port ${PORT}`);
    console.log(
      `🟢 Swagger opened in http://localhost:${PORT}/${constants.api.prefix}`,
    );
  });
}
bootstrap();
