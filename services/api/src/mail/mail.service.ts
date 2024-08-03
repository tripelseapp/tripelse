import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from 'interfaces/event-types.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('user.welcome')
  async welcomeEmail(data: EventPayloads['user.welcome']) {
    const { email, name } = data;

    const subject = `Welcome to ${name}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './welcome',
      context: {
        name,
      },
    });
  }
  @OnEvent('trip.invitation')
  async tripInvitation(data: EventPayloads['trip.invitation']) {
    const { email, trip, currentUserId } = data;
    const name = 'Tripelse';
    const subject = `Your new trip "${trip.name}" !`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './welcome',

      context: {
        name,
        trip,
        currentUserId,
      },
    });
  }

  @OnEvent('user.password.reset')
  async forgotPasswordEmail(data: EventPayloads['user.password.reset']) {
    const { email, resetUrl, username } = data;

    const subject = `Tripelse: Reset Password`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './forgot-password',
      context: {
        resetUrl,
        username,
      },
    });
  }

  @OnEvent('user.verify-email')
  async verifyEmail(data: EventPayloads['user.verify-email']) {
    const { name, email, otp } = data;

    const subject = `Company: OTP To Verify Email`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './verify-email',
      context: {
        otp,
        name,
      },
    });
  }
}
