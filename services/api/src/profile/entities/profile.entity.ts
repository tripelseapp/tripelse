import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, now } from 'mongoose';

@Schema()
export class Profile {
  @Prop({ type: String })
  bio: string | null;

  @Prop({ type: String })
  avatar: string | null;

  @Prop({ required: true })
  followers: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true })
  following: MongooseSchema.Types.ObjectId[];
  @Prop({ required: true, default: now() })
  createdAt: Date;

  @Prop({ required: true, default: now() })
  updatedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string; // This is the reference to the user
}

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);