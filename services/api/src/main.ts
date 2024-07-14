import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

const PORT = parseInt(process.env.PORT, 10) || 4000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // register all plugins and extension
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}));

  app.use(compression());

  await app.listen(PORT, () => {
    console.log('MONGO_URI:', process.env.CONNECT_STRING);
    console.log(`🚀 Application running at port ${PORT}`);
  });
}
bootstrap();
