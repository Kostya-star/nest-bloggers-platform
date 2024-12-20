import { IUserDocument } from '../../domain/user.schema';

export class GetMeViewDto {
  userId: string;
  login: string;
  email: string;

  constructor(user: IUserDocument) {
    this.userId = user._id.toString();
    this.login = user.login;
    this.email = user.email;
  }
}
