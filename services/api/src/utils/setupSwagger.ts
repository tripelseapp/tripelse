import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { constants } from '../constants/constants';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Tripelse API')
    .setDescription('Visible endpoints for Tripelse API')
    .setVersion('1.0')
    .addCookieAuth(
      constants.cookies.accessToken,
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'Access token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha', // Sort tags alphabetically for better organization
      operationsSorter: 'alpha', // Sort operations within each tag alphabetically
      docExpansion: 'none',
      requestInterceptor: (req: any) => {
        req.credentials = 'include';
        return req;
      },
    },
  });
}
