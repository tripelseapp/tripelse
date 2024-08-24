import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ResetPasswordDto,
  ResetPasswordResponseDto,
  resetPasswordResponseExample,
} from 'auth/dto/new-password.dto';
import { ResetPasswordService } from 'auth/services/reset-password.service';
import { Public } from 'common/decorators/publicRoute.decorator';
import config from 'config/config';
import { TypedEventEmitter } from 'event-emitter/typed-event-emitter.class';
import mongoose from 'mongoose';
import { TemporalTokenService } from 'temporal-token/services/temporal-token.service';
import { TemporalTokenEnum } from 'temporal-token/types/temporal-token.types';
import { UserService } from 'user/services/user.service';
import { getUserProfileDetails } from 'user/utils/get-users-profile-details';

@Controller('password-reset')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth / Reset Password')
export class ResetPasswordController {
  constructor(
    private readonly resetPasswordService: ResetPasswordService,
    private readonly userService: UserService,
    private readonly tokenService: TemporalTokenService,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  //  - request a user Password email by email
  @Public()
  @Post(':email/request')
  @ApiOperation({
    summary: 'Sends a password reset email',
    description:
      'Sends a password reset email to the user with the provided email',
  })
  async request(@Param('email') email: string): Promise<{
    message: string;
  }> {
    const user = await this.userService.findUser({ email });
    if (!user) throw new NotFoundException('User not found');
    const parsedUser = getUserProfileDetails(user);
    const userId = parsedUser.id.toString();
    const duration = 3600000; // 1 hour
    const tokenType = TemporalTokenEnum.password_reset;

    const tokenGenerated = new mongoose.Types.ObjectId().toHexString();

    const token = await this.tokenService.create({
      type: tokenType,
      token: tokenGenerated,
      userId,
      expiresAt: new Date(Date.now() + duration),
    });

    if (!token) throw new InternalServerErrorException('Token not created');

    const resetUrl = `${
      config().client.domain
    }/auth/reset-password?token=${tokenGenerated}`;

    // Emit an event to send an email
    this.eventEmitter.emit('user.password.reset', {
      email,
      resetUrl,
      username: user.username,
    });
    return {
      message: 'Password reset email sent',
    };
  }

  @Public()
  @Patch('update-password')
  @ApiOperation({
    summary: 'Update password',
    description:
      'Update the password of the user with the provided token and new password',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ResetPasswordResponseDto,
    description: 'Password updated successfully',
    example: resetPasswordResponseExample,
  })
  async updatePassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const newPassword = resetPasswordDto.newPassword;
    const token = resetPasswordDto.token;
    if (!token) {
      throw new BadRequestException('Token cannot be empty');
    }
    // token needs to be a valid mongoose stringified objectId
    if (!mongoose.Types.ObjectId.isValid(token)) {
      throw new BadRequestException('Invalid token');
    }

    if (!newPassword) {
      throw new BadRequestException('Password cannot be empty');
    }
    await this.resetPasswordService.updatePassword(token, newPassword);
    return {
      message: 'Password updated successfully',
    };
  }
}
