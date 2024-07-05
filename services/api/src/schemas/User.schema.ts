import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
