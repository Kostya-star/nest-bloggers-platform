import { IUserDocument } from '../../domain/user.schema';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;

  constructor(user: IUserDocument) {
    this.id = user._id.toString();
    this.login = user.login;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
