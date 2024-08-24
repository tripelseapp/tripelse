import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResetPasswordResponseDto } from 'auth/dto/new-password.dto';
import { ValidateUserService } from 'auth/services/validate-user.service';
import { ReqWithUser } from 'auth/types/token-payload.type';
import config from 'config/config';
import { TypedEventEmitter } from 'event-emitter/typed-event-emitter.class';
import mongoose from 'mongoose';
import { TemporalTokenService } from 'temporal-token/services/temporal-token.service';
import { TemporalTokenEnum } from 'temporal-token/types/temporal-token.types';
import { UserService } from 'user/services/user.service';
import { getUserProfileDetails } from 'user/utils/get-users-profile-details';

@Controller('validate-email')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth / Validate email')
export class ValidateEmailController {
  constructor(
    private readonly validateUserService: ValidateUserService,
    private readonly userService: UserService,
    private readonly tokenService: TemporalTokenService,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  //  - request a user Password email by email
  @Post('request')
  @ApiOperation({
    summary: 'Sends a password reset email',
    description:
      'Sends a password reset email to the user with the provided email',
  })
  async request(@Req() request: ReqWithUser): Promise<{
    message: string;
  }> {
    const email: string = request.user.email;
    if (!email) {
      throw new BadRequestException(
        'Your are not logged in correctly, logout and login again',
      );
    }
    const user = await this.userService.findUser({ email });
    if (!user) throw new NotFoundException('User not found');
    const parsedUser = getUserProfileDetails(user);
    const userId = parsedUser.id.toString();
    const duration = 3600000; // 1 hour
    const tokenType = TemporalTokenEnum.email_verification;

    const tokenGenerated = new mongoose.Types.ObjectId().toHexString();

    const token = await this.tokenService.create({
      type: tokenType,
      token: tokenGenerated,
      userId,
      expiresAt: new Date(Date.now() + duration),
    });

    if (!token) throw new InternalServerErrorException('Token not created');

    const url = `${
      config().client.domain
    }/auth/validate-email/${tokenGenerated}`;

    // Emit an event to send an email
    this.eventEmitter.emit('user.email.validate', {
      email,
      url,
      username: user.username,
    });
    return {
      message: 'Password reset email sent',
    };
  }

  @Patch(':token')
  @ApiOperation({
    summary: 'Updates the verification date of the email',
    description:
      'Updates the verification date of the email to the current date',
  })
  async updateVerifyEmail(
    @Param('token') token: string,
  ): Promise<ResetPasswordResponseDto> {
    if (!token) {
      throw new BadRequestException('Token cannot be empty');
    }
    // token needs to be a valid mongoose stringified objectId
    if (!mongoose.Types.ObjectId.isValid(token)) {
      throw new BadRequestException('Invalid token');
    }

    await this.validateUserService.validateEmail(token);
    return {
      message: 'Email verified successfully',
    };
  }
}
