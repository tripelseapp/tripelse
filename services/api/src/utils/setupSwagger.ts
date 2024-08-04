import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configuration from 'config/config';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Tripelse API')
    .setDescription('Visible endpoints for Tripelse API')
    .setVersion('1.0')
    .addCookieAuth(
      configuration().jwt.accessTokenCookie,
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
      filter: true, // Allows filtering the endpoints
      showRequestDuration: true,
      tagsSorter: 'alpha', // Sort tags alphabetically for better organization
      operationsSorter: 'alpha', // Sort operations within each tag alphabetically
      docExpansion: 'none',
      deepLinking: true,
      displayOperationId: false,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true, // Enable the "Try it out" feature by default
      syntaxHighlight: {
        activate: true,
        theme: 'agate', // Options: 'agate', 'arta', 'monokai', etc.
      },
      showCommonExtensions: true,
      customSiteTitle: 'Tripelse API',

      requestInterceptor: (req: any) => {
        req.credentials = 'include';
        return req;
      },
    },
  });
}
