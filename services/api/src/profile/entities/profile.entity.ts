import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, now } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ProfileEntity {
  @Prop({ type: String })
  bio: string | null;

  @Prop({ required: true, default: null, type: String })
  givenName: string | null;

  @Prop({ required: false, default: null, type: String })
  familyName: string | null;

  @Prop({ type: String, default: null })
  avatar: string | null;

  @Prop({ required: true, default: [] })
  followers: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true, default: [] })
  following: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true, default: now() })
  createdAt: Date;

  @Prop({ required: true, default: now() })
  updatedAt: Date;
}

export type ProfileDocument = HydratedDocument<ProfileEntity>;

export const ProfileSchema = SchemaFactory.createForClass(ProfileEntity);
ProfileSchema.pre<ProfileEntity>('save', async function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});
