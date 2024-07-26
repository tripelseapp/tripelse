import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

// TO AVOID CIRCULAR DEPENDENCIES, NEVER REFERENCE USERENTITY DIRECTLY
@Schema({
  timestamps: true,
})
export class ProfileEntity {
  @Prop({ default: null, type: String })
  bio: string | null;

  @Prop({ required: false, default: null, type: String })
  givenName: string | null;

  @Prop({ required: false, default: null, type: String })
  familyName: string | null;

  @Prop({ type: String, default: null })
  avatar: string | null;

  @Prop({ required: false, default: null, type: Date })
  birthDate: Date | null;

  @Prop({ required: true, default: [] })
  followers: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true, default: [] })
  following: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  // @Prop({
  //   required: true,
  //   default: [],
  //   type: [{ type: MongooseSchema.Types.ObjectId, ref: 'TripEntity' }],
  // })
  // favoriteTrips: MongooseSchema.Types.ObjectId[];
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
