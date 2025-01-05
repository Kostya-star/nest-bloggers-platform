import { User } from '../../domain/user.schema-typeorm';

export class GetMeViewDto {
  userId: string;
  login: string;
  email: string;

  constructor(user: User) {
    this.userId = user.id.toString();
    this.login = user.login;
    this.email = user.email;
  }
}
