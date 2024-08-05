import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('welcome')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'tripelseapp@gmail.com',
        },
      },
    },
  })
  async welcomeEmail(@Body() body: { email: string }) {
    const name = 'Tripelse';

    const data = {
      email: body.email,
      name,
    };

    return this.mailService.welcomeEmail(data);
  }
}
