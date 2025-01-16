import { Like } from '../../likes/domain/likes.schema-typeorm';

export class JoinedLike extends Like {
  userLogin: string;
}
