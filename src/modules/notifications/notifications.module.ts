import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { CoreConfig } from 'src/core/core.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        transport: {
          service: 'Mail.ru',
          auth: {
            user: coreConfig.mailSenderName,
            pass: coreConfig.mailSenderPassword,
          },
        },
        defaults: {
          from: `"Nest App" <${coreConfig.mailSenderName}>`,
        },
      }),
      inject: [CoreConfig],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
