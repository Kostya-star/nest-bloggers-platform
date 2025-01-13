import { Like } from '../../likes/domain/likes.schema-typeorm';

export class JoinedLike extends Like {
  user_login: string;
}
