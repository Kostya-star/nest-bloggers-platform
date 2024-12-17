import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'Mail.ru',
          auth: {
            user: configService.get<string>('MAIL_SENDER_NAME'),
            pass: configService.get<string>('MAIL_SENDER_PASSWORD'),
          },
        },
        defaults: {
          from: `"Nest App" <${configService.get<string>('MAIL_SENDER_NAME')}>`,
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
