import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import config from 'config/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config().email.host,
        port: Number(config().email.port),
        secure: true,
        auth: {
          user: config().email.user,
          pass: config().email.password,
        },
      },
      defaults: {
        from: `"Tripelse" <${config().email.user}>`,
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
