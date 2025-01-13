import { Injectable } from '@nestjs/common';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ICommentModel } from '../domain/comments.schema';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UpdateCommentInputDto } from '../api/input-dto/update-comment-input.dto';
import { Comment } from '../domain/comments.schema-typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsCommandsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: ICommentModel,
    private dataSource: DataSource,
  ) {}
  // async getCommentById(commentId: string): Promise<ICommentDB | null> {
  //   return await CommentModel.findOne({ _id: commentId });
  // }

  async createComment({ content, postId, userId }: CreatePostCommentDto): Promise<string> {
    const comment = await this.dataSource.query<Comment[]>(
      `
        INSERT INTO comments (content, "postId", "userId")
        VALUES ($1, $2, $3)
        RETURNING comments.id;
      `,
      [content, postId, userId],
    );

    return comment[0].id.toString();
  }

  async updateComment(commentId: string, updates: UpdateCommentInputDto): Promise<void> {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');

    await this.dataSource.query(
      `
        UPDATE comments
        SET ${setClause}
        WHERE id = $1
      `,
      [commentId, ...values],
    );
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.dataSource.query(
      `
        DELETE FROM comments
        WHERE id = $1
      `,
      [commentId],
    );
  }
}
