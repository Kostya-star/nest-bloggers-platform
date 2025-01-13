import { Comment } from '../domain/comments.schema-typeorm';

export class JoinedComment extends Comment {
  user_login: string;
}
