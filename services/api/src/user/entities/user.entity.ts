import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/*
Entity (User): Represents your MongoDB schema and is directly tied to your database structure. It includes all fields defined in your schema, such as username, email, password, role, createdAt, and potentially other fields.
*/
export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  role: 'admin' | 'user';

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
