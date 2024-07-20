import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/setupSwagger';
import configuration from './config/configuration';
import helmet from 'helmet';
import { constants } from 'constants/constants';
import cookieParser from 'cookie-parser';

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

  setupSwagger(app);

  await app.listen(PORT, () => {
    console.log(`🚀 Application running at port ${PORT}`);
    console.log(
      `🟢 Swagger opened in http://localhost:${PORT}/${constants.api.prefix}`,
    );
  });
}
bootstrap();
