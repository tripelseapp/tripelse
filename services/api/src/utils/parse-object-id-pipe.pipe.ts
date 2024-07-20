import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';
/**
 * @name ParseObjectIdPipe
 * @description Determinar si el identificador es válido para MongoDB Lanzar una excepción si el identificador no es válido Devolver el valor si el identificador es válido Uso del pipe en los controladores. El pipe ParseObjectIdPipe definido se usará en los controladores que tengan endpoints que acepten identificadores MongoDB. El pipe se colocará después del parámetro id leído en la URL.
 * @see https://ualmtorres.github.io/nestjs-mongodb-tutorial/
 *
 */

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<any, mongoose.Types.ObjectId>
{
  transform(value: any): mongoose.Types.ObjectId {
    const validObjectId: boolean = mongoose.isObjectIdOrHexString(value);
    if (!validObjectId) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return value;
  }
}
