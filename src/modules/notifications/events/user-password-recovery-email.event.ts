import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../email.service';

export class UserPasswordRecoveryEmailEvent {
  constructor(
    public readonly senderEmail: string,
    public readonly receiverEmail: string,
    public readonly subject: string,
    public readonly message: string,
  ) {}
}

@EventsHandler(UserPasswordRecoveryEmailEvent)
export class UserPasswordRecoveryEmailEventHandler implements IEventHandler<UserPasswordRecoveryEmailEvent> {
  constructor(private readonly emailService: EmailService) {}

  async handle({ senderEmail, receiverEmail, subject, message }: UserPasswordRecoveryEmailEvent) {
    // errors thrown by event handlers are not caught by the exception filters, so we need to catch them here

    try {
      await this.emailService.sendMail(senderEmail, receiverEmail, subject, message);
    } catch (error) {
      console.error('Error when sending user-password-recovery-email-event', error);
    }
  }
}