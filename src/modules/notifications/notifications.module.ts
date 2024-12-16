// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { EmailService } from './email.service';

// @Module({
//   imports: [
//     MailerModule.forRoot({
//       // transport: `smtps://${process.env.MAIL_SENDER_NAME}:${process.env.MAIL_SENDER_PASSWORD}`,
//       transport: {
//         // host: 'localhost',
//         // port: 1025,
//         // ignoreTLS: true,
//         // secure: false,
//         service: 'Mail.ru',
//         auth: {
//           user: process.env.MAIL_SENDER_NAME,
//           pass: process.env.MAIL_SENDER_PASSWORD,
//         },
//       },
//       defaults: {
//         // auth
//         from: '"nest-modules" <modules@nestjs.com>',
//       },
//       options: {
//         logger: true,
//         debug: true,
//       },
//     }),
//   ],
//   providers: [EmailService],
//   exports: [EmailService],
// })
// export class NotificationsModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.mail.ru', // Explicit SMTP host for Mail.ru
          port: 465, // SMTP port for SSL
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_SENDER_NAME'), // Get from .env
            pass: configService.get<string>('MAIL_SENDER_PASSWORD'), // Get from .env
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
