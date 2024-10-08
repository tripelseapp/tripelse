import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { hashPassword } from 'user/utils/password-utils';
import { Role, RolesEnum, roles } from '../types/role.types';

/*
Entity (User): Represents your MongoDB schema and is directly tied to your database structure. It includes all fields defined in your schema, such as username, email, password, role, createdAt, and potentially other fields.
*/
// User is all related with the pure user, like role or login fields, the profile is in another entity where we can store more information about the user.

@Schema({
  timestamps: true,
})
export class UserEntity {
  @Prop({ unique: true })
  username: string;

  @Prop({ select: false, default: null, type: String })
  password: string | null;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null, select: true, type: Date })
  emailVerified: null | Date;

  @Prop({ type: [String], enum: roles, default: [RolesEnum.USER] })
  roles: Role[];

  @Prop({ type: [{ provider: String, providerId: String }], default: [] })
  socialLogins: { provider: string; providerId: string }[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileEntity' })
  profile: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserEntity>;

export const UserSchema = SchemaFactory.createForClass(UserEntity);

UserSchema.pre<UserEntity>('save', async function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  if (this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});
