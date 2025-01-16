import { Comment } from '../domain/comments.schema-typeorm';

export class JoinedComment extends Comment {
  userLogin: string;
}
