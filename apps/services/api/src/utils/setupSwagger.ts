import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Tripelse API')
    .setDescription('Visible endpoints for Tripelse API')
    .setVersion('1.0')
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

      tryItOutEnabled: true, // Enable the "Try it out" feature by default
      syntaxHighlight: {
        activate: true,
        theme: 'agate', // Options: 'agate', 'arta', 'monokai', etc.
      },
    },
  });
}
