import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponseOptions, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const GenericUnauthorizedResponse = (options?: ApiResponseOptions) => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      ...options,
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 401,
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
      },
    }),
  );
};
