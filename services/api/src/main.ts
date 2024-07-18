import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/setupSwagger';
import configuration from './config/configuration';
import cookieParser from 'cookie-parser';

const PORT = configuration().port;
async function bootstrap() {
  console.log(process.env.CONNECT_STRING);

  const app = await NestFactory.create(AppModule); //
  // register all plugins and extension
  app.enableCors({ origin: '*' });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app);

  await app.listen(PORT, () => {
    console.log(`🚀 Application running at port ${PORT}`);
    console.log(`🟢 Swagger opened in http://localhost:${PORT}/api`);
  });
}
bootstrap();
