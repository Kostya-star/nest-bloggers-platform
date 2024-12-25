import { OmitType } from '@nestjs/swagger';
import { CommentsViewDto } from '../api/view-dto/comments-view.dto';

export class CreatePostCommentDto extends OmitType(CommentsViewDto, ['id', 'createdAt', 'likesInfo']) {
  content: string;
  postId: string;
}
