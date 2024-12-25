import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../email.service';

export class UserRegisteredConfirmationEmailEvent {
  constructor(
    public readonly senderEmail: string,
    public readonly receiverEmail: string,
    public readonly subject: string,
    public readonly message: string,
  ) {}
}

@EventsHandler(UserRegisteredConfirmationEmailEvent)
export class UserRegisteredConfirmationEmailEventHandler
  implements IEventHandler<UserRegisteredConfirmationEmailEvent>
{
  constructor(private readonly emailService: EmailService) {}

  async handle({ senderEmail, receiverEmail, subject, message }: UserRegisteredConfirmationEmailEvent) {
    // errors thrown by event handlers are not caught by the exception filters, so we need to catch them here
    try {
      await this.emailService.sendMail(senderEmail, receiverEmail, subject, message);
    } catch (error) {
      console.error('Error when sending user-registered-confirmation-event', error);
    }
  }
}
