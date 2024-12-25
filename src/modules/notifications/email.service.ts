import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(from: string, to: string, subject: string, message: string) {
    return await this.mailerService.sendMail({ from, to, subject, html: message });
  }

  getEmailMessageTemplate(link: string, subj: string, queryParam: string, code: string): string {
    return `
      <h1>${subj}</h1>
      <p>To finish, please follow the link below:
          <a href='http://localhost:8000/auth/${link}?${queryParam}=${code}'>${subj}</a>
      </p>
      <b>You have 5 minutes!</b>
    `;
  }
}
