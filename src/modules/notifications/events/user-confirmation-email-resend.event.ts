import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../email.service';

export class UserConfirmationEmailResendEvent {
  constructor(
    public readonly senderEmail: string,
    public readonly receiverEmail: string,
    public readonly subject: string,
    public readonly message: string,
  ) {}
}

@EventsHandler(UserConfirmationEmailResendEvent)
export class UserConfirmationEmailResendEventHandler implements IEventHandler<UserConfirmationEmailResendEvent> {
  constructor(private readonly emailService: EmailService) {}

  async handle({ senderEmail, receiverEmail, subject, message }: UserConfirmationEmailResendEvent) {
    // errors thrown by event handlers are not caught by the exception filters, so we need to catch them here

    try {
      await this.emailService.sendMail(senderEmail, receiverEmail, subject, message);
    } catch (error) {
      console.error('Error when sending user-confirmation-email-resend-event', error);
    }
  }
}
