import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input.dto/create-user-input.dto';
import { UserEmailConfirmationDto } from '../../users/api/input.dto/user-email-confirmation.dto';
import { v4 as uuidv4 } from 'uuid';
import { add, isAfter } from 'date-fns';
import { UsersService } from '../../users/application/users.service';
import { EmailService } from 'src/modules/notifications/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}
  async registration(userBody: CreateUserInputDto): Promise<void> {
    const emailConfirmation = this.createEmailConfirmationDTO();

    const newUser = await this.usersService.createUser(userBody, emailConfirmation);

    const message = this.createEmailMessageDTO(
      'registration-confirmation',
      'Confirm registration',
      'code',
      emailConfirmation.code!,
    );

    try {
      await this.emailService.sendMail(
        "'Igor' kostya.danilov.99@mail.ru",
        userBody.email,
        'Registration Confirmation',
        message,
      );
    } catch (err) {
      await this.usersService.deleteUser(newUser._id.toString());
      console.error('Error sending email:', err);
      throw new ServiceUnavailableException('Email service is currently unavailable');
    }
  }

  createEmailConfirmationDTO(): UserEmailConfirmationDto {
    return {
      code: uuidv4(),
      expDate: add(new Date(), {
        minutes: 5,
      }),
      isConfirmed: false,
    };
  }

  createEmailMessageDTO(link: string, subj: string, queryParam: string, code: string): string {
    return `
    <h1>${subj}</h1>
    <p>To finish, please follow the link below:
        <a href='http://localhost:8000/auth/${link}?${queryParam}=${code}'>${subj}</a>
    </p>
    <b>You have 5 minutes!</b>
    `;
  }
}