import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { SavedTripsDocument } from './saved-trips.entity';

@Schema({
  timestamps: true,
})
export class ProfileEntity {
  @Prop({ default: null, type: String })
  bio: string | null;

  @Prop({ required: true, type: String })
  givenName: string;

  @Prop({ required: false, default: null, type: String })
  familyName: string | null;

  @Prop({ type: String, default: null })
  avatar: string | null;

  @Prop({ required: false, default: null, type: Date })
  birthDate: Date | null;

  @Prop({
    required: true,
    default: [],
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'ProfileEntity' }],
  })
  followers: string[];
  @Prop({
    required: true,
    default: [],
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'ProfileEntity' }],
  })
  following: string[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'SavedTripsEntity' }],
    default: [],
  })
  savedTrips: SavedTripsDocument[];
}

export type ProfileDocument = HydratedDocument<ProfileEntity>;

export const ProfileSchema = SchemaFactory.createForClass(ProfileEntity);
ProfileSchema.index({ followers: 1 });
ProfileSchema.index({ following: 1 });

ProfileSchema.pre<ProfileEntity>('save', async function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});
