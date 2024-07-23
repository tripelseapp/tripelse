import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, now } from 'mongoose';
import { UserDetails } from 'user/dto/user-details.dto';

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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: UserDetails;
}

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);
