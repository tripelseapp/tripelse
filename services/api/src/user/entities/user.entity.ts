import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { hashPassword } from 'user/utils/password-utils';
import { Role } from '../types/role.types';

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

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  //para populate
  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Profile' })
}

export type UserDocument = HydratedDocument<UserEntity>;

export const UserSchema = SchemaFactory.createForClass(UserEntity);

UserSchema.pre<UserEntity>('save', async function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.password = await hashPassword(this.password);
  next();
});
