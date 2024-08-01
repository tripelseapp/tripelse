import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: Number(465),
        secure: true,
        auth: {
          user: 'tripelseapp@gmail.com',
          pass: 'ttiq zpvu blot jnbv',
        },
      },
      defaults: {
        from: '"Tripelse (No Reply)" <tripelseapp@gmail.com>',
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
