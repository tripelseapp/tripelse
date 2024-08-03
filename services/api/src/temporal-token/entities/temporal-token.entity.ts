import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { TemporalTokenEnum } from 'temporal-token/types/temporal-token.types';

@Schema({
  timestamps: true,
})
export class TemporalTokenEntity {
  @Prop({
    type: String,
    required: true,
    enum: Object.values(TemporalTokenEnum),
  })
  type: TemporalTokenEnum;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'UserEntity',
  })
  userId: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export type TemporalTokenDocument = HydratedDocument<TemporalTokenEntity>;

export const TemporalTokenSchema =
  SchemaFactory.createForClass(TemporalTokenEntity);
