import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/setupSwagger';
import configuration from './config/configuration';
import helmet from 'helmet';
import { constants } from 'constants/constants';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

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
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    session({
      secret: 'randomString',
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
