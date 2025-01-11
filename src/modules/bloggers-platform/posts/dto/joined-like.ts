import { Like } from '../../likes/domain/likes.schema-typeorm';

// __ASK__
export class JoinedLike extends Like {
  user_login: string;
}
