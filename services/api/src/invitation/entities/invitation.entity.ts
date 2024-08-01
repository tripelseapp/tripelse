import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class InvitationEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TripEntity',
    required: true,
  })
  tripId: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserEntity',
    required: true,
  })
  inviterId: string;

  @Prop({ type: String, required: true, trim: true })
  inviteeEmail: string;

  @Prop({ type: String, default: 'pending' })
  status: string;

  @Prop({ required: true, default: Date.now })
  invitationDate: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export type InvitationDocument = HydratedDocument<InvitationEntity>;

export const InvitationSchema = SchemaFactory.createForClass(InvitationEntity);

InvitationSchema.pre<InvitationEntity>('save', async function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.invitationDate) {
    this.invitationDate = now;
  }
  next();
});
