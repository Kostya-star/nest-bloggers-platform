// export class CreatePostCommentDto extends OmitType(CommentsViewDto, ['id', 'createdAt', 'likesInfo']) {
//   content: string;
//   postId: string;
// }
export class CreatePostCommentDto {
  content: string;
  postId: string;
  userId: string;
}
