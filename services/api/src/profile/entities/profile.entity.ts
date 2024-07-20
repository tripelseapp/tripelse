import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, now } from 'mongoose';

@Schema()
export class Profile {
  @Prop({ required: true })
  bio: string;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: true })
  followers: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true })
  following: MongooseSchema.Types.ObjectId[];
  @Prop({ required: true, default: now() })
  createdAt: Date;

  @Prop({ required: true, default: now() })
  updatedAt: Date;
}

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);
