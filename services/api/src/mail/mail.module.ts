import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { constants } from 'constants/constants';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: constants.mail.host,
        port: Number(465),
        secure: true,
        auth: {
          user: constants.mail.user,
          pass: constants.mail.pass,
        },
      },
      defaults: {
        from: `"Tripelse" <${constants.mail.user}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],

  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
