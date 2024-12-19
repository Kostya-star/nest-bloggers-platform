import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input.dto/create-user-input.dto';
import { UserEmailConfirmationDto } from '../../users/api/input.dto/user-email-confirmation.dto';
import { v4 as uuidv4 } from 'uuid';
import { add, isAfter } from 'date-fns';
import { UsersService } from '../../users/application/users.service';
import { EmailService } from 'src/modules/notifications/email.service';
import { UsersCommandsRepository } from '../../users/infrastructure/users-commands-repository';
import { UserContext } from 'src/core/dto/user-context';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginCredentialsDto } from '../api/input.dto/login-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usersCommandsRepository: UsersCommandsRepository,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}
  async registration(userBody: CreateUserInputDto): Promise<void> {
    const emailConfirmation = this.createEmailConfirmationDTO();

    await this.usersService.createUser(userBody, emailConfirmation);

    const message = this.createEmailMessageDTO(
      'registration-confirmation',
      'Confirm registration',
      'code',
      emailConfirmation.code!,
    );

    // try {
    this.emailService.sendMail(
      "'Igor' kostya.danilov.99@mail.ru",
      userBody.email,
      'Registration Confirmation',
      message,
    );
    // } catch (err) {
    // await this.usersService.deleteUser(newUser._id.toString());
    // console.error('Error sending email:', err);
    // throw new ServiceUnavailableException('Email service is currently unavailable');
    // }
  }

  async confirmRegistration(code: string): Promise<void> {
    const user = await this.usersCommandsRepository.findUserByCode(code);

    if (!user) {
      throw new BadRequestException([{ field: 'code', message: 'Code is incorrect' }]);
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([{ field: 'code', message: 'Code has been applied' }]);
    }

    const isExpired = isAfter(new Date(), user.emailConfirmation.expDate as Date);

    if (isExpired) {
      throw new BadRequestException([{ field: 'code', message: 'Code expired' }]);
    }

    await this.usersCommandsRepository.updateUserEmailConfirmation(user._id.toString(), {
      ...user.emailConfirmation,
      isConfirmed: true,
    });
  }

  async resendCode(email: string): Promise<void> {
    const user = await this.usersCommandsRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException([{ field: 'email', message: 'Email is incorrect' }]);
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([{ field: 'email', message: 'Code has been applied' }]);
    }

    const emailConfirmation = this.createEmailConfirmationDTO();

    await this.usersCommandsRepository.updateUserEmailConfirmation(user._id.toString(), emailConfirmation);

    const message = this.createEmailMessageDTO(
      'registration-confirmation',
      'Confirm registration',
      'code',
      emailConfirmation.code!,
    );

    this.emailService.sendMail("'Petr' kostya.danilov.99@mail.ru", user.email, 'Registration Confirmation', message);
  }

  async login(
    { loginOrEmail, password }: LoginCredentialsDto,
    // userAgent: string,
    // ipAddress: string,
  ): Promise<{ accessToken: string /*refreshToken: string*/ }> {
    const user = await this.usersCommandsRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword!);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    // const deviceId = uuidv4();

    const accessToken = this.jwtService.sign({ userId: user._id.toString() });
    // const refreshToken = jwt.sign({ userId: user._id, deviceId }, process.env.REFRESH_TOKEN_SECRET!, {
    //   expiresIn: REFRESH_TOKEN_EXP_TIME,
    // });

    // const { iat, exp } = jwt.decode(refreshToken) as IRefreshTokenDecodedPayload;

    // const iatISO = getISOFromUnixSeconds(iat);
    // const expISO = getISOFromUnixSeconds(exp);

    // await this.sessionsService.createSession({
    //   deviceId,
    //   userId: user._id,
    //   issuedAt: iatISO,
    //   expiresAt: expISO,
    //   userAgent,
    //   ipAddress,
    //   lastActiveDate: iatISO,
    // });

    return { accessToken /*refreshToken*/ };
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
