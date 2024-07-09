import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { setupSwagger } from './utils/setupSwagger';

const PORT = parseInt(process.env.PORT, 10) || 4000;
async function bootstrap() {
  console.log(process.env.CONNECT_STRING);

  const app = await NestFactory.create(AppModule); //
  // register all plugins and extension
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(compression());

  setupSwagger(app);

  await app.listen(PORT, () => {
    console.log(`🚀 Application running at port ${PORT}`);
    console.log(`🟢 Swagger opened in http://localhost:${PORT}/api`);
  });
}
bootstrap();
