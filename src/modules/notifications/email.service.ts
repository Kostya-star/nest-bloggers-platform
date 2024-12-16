import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(from: string, to: string, subject: string, message: string) {
    return await this.mailerService.sendMail({ from, to, subject, html: message });
  }
}
