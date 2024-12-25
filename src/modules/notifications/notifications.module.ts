import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { CoreConfig } from 'src/core/core.config';
import { UserRegisteredConfirmationEmailEventHandler } from './events/user-registered-confirmation-email.event';
import { UserConfirmationEmailResendEventHandler } from './events/user-confirmation-email-resend.event';
import { UserPasswordRecoveryEmailEventHandler } from './events/user-password-recovery-email.event';

const events = [
  UserRegisteredConfirmationEmailEventHandler,
  UserConfirmationEmailResendEventHandler,
  UserPasswordRecoveryEmailEventHandler,
];

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
  providers: [EmailService, ...events],
  exports: [EmailService],
})
export class NotificationsModule {}
