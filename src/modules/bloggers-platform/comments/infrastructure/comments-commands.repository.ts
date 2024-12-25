import { Injectable } from '@nestjs/common';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, ICommentModel } from '../domain/comments.schema';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';

@Injectable()
export class CommentsCommandsRepository {
  constructor(@InjectModel(Comment.name) private CommentModel: ICommentModel) {}
  // async getCommentById(commentId: string): Promise<ICommentDB | null> {
  //   return await CommentModel.findOne({ _id: commentId });
  // }

  async createComment(postComment: CreatePostCommentDto): Promise<MongooseObjtId> {
    const comment = await this.CommentModel.create(postComment);
    return comment._id;
  }

  async updateComment(commentId: string, updates: { content: string }): Promise<void> {
    await this.CommentModel.updateOne({ _id: commentId }, updates);
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.CommentModel.deleteOne({ _id: commentId });
  }
}
