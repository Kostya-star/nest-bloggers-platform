import { Injectable } from '@nestjs/common';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { UpdateCommentInputDto } from '../api/input-dto/update-comment-input.dto';
import { Comment } from '../domain/comments.schema-typeorm';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsCommandsRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}
  // async getCommentById(commentId: string): Promise<ICommentDB | null> {
  //   return await CommentModel.findOne({ _id: commentId });
  // }

  async createComment(newComm: CreatePostCommentDto): Promise<number> {
    // const comment = await this.dataSource.query<Comment[]>(
    //   `
    //     INSERT INTO comments (content, "postId", "userId")
    //     VALUES ($1, $2, $3)
    //     RETURNING comments.id;
    //   `,
    //   [content, postId, userId],
    // );

    // return comment[0].id.toString();

    const comment = this.commentsRepository.create({
      content: newComm.content,
      postId: newComm.postId,
      userId: newComm.userId,
    });

    const savedComm = await this.commentsRepository.save(comment);
    return savedComm.id;
  }

  async updateComment(commentId: number, updates: UpdateCommentInputDto): Promise<void> {
    await this.commentsRepository.update(commentId, updates);
  }

  async deleteComment(commentId: number): Promise<void> {
    await this.commentsRepository.delete(commentId);
  }
}
