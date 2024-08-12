import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from 'interfaces/event-types.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('user.welcome')
  async welcomeEmail(data: EventPayloads['user.welcome']) {
    const { email, username } = data;
    const appName = 'Tripelse';
    const subject = `Welcome to ${appName}`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './welcome',
      context: {
        appName,
        username,
      },
    });
  }

  @OnEvent('trip.invitation.known')
  async tripInvitationKnown(data: EventPayloads['trip.invitation.known']) {
    const { email, trip, receptor, creator } = data;
    const name = 'Tripelse';
    const subject = `Your new trip "${trip.name}" !`;

    //   await this.mailerService.sendMail({
    //     to: email,
    //     subject,
    //     template: './welcome',
    //     context: {
    //       name,
    //       trip,
    //       receptor,
    //       creator,
    //     },
    //   });
    // }
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

  @OnEvent('user.email.validate')
  async verifyEmail(data: EventPayloads['user.email.validate']) {
    const { username, email, url } = data;

    const subject = `Tripelse: Verify Email`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './email-verification',
      context: {
        url,
        username,
      },
    });
  }
}
