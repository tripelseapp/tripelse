import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageDto } from 'src/common/dto/pagination/page.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiExtraModels(PageDto, model),
    ApiOkResponse({
      ...options,
      description: 'Successfully received model list',
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(PageDto),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
