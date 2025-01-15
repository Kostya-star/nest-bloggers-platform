import { User } from '../../domain/user.schema-typeorm';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id.toString();
    this.login = user.login;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
