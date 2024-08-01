import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InvitationEntity,
  InvitationSchema,
} from './entities/invitation.entity';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';

@Module({
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
  imports: [
    MongooseModule.forFeature([
      {
        name: InvitationEntity.name,
        schema: InvitationSchema,
      },
    ]),
  ],
})
export class InvitationModule {}
