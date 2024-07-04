import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const PORT = parseInt(process.env.PORT, 10) || 4000;
async function bootstrap() {
  console.log(process.env.CONNECT_STRING);

  const app = await NestFactory.create(AppModule); //
  // register all plugins and extension
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}));
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('Tripelse API')
    .setDescription('Visible endpoints for Tripelse API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {});

  await app.listen(PORT, () => {
    console.log(`🚀 Application running at port ${PORT}`);
    console.log(`🟢 Swagger opened in http://localhost:${PORT}/api`);
  });
}
bootstrap();
