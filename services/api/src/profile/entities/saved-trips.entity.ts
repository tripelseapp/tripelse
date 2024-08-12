import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
})
export class SavedTripsEntity {
  @ApiProperty({
    description: 'The name of the saved trip folder',
    example: 'Summer Vacation Plans',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Array of trip IDs saved in the folder',
    type: [String],
    example: ['60c72b2f5f1b2c001c8e4df0', '60c72b2f5f1b2c001c8e4df1'],
  })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'TripEntity' }] })
  trips: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
export type SavedTripsDocument = HydratedDocument<SavedTripsEntity>;

export const SavedTripsSchema = SchemaFactory.createForClass(SavedTripsEntity);
SavedTripsSchema.pre<SavedTripsEntity>('save', async function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});
