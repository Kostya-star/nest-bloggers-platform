import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../const/like-status';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../domain/likes.schema-typeorm';

@Injectable()
export class LikesCommandRepository {
  constructor(@InjectRepository(Like) private likesRepository: Repository<Like>) {}

  async updateLike(likedEntityId: number, status: LikeStatus, userId: number): Promise<void> {
    await this.likesRepository
      .createQueryBuilder()
      .insert()
      .into(Like)
      .values({ likedEntityId, status, userId })
      .orUpdate(
        ['status'], // columns to update
        ['likedEntityId', 'userId'], // unique constraint columns
      )
      .execute();

    // this.likesRepository.createQueryBuilder()
    //       .insert()
    //       .into(Like)
    //       .values({ likedEntityId, status, userId })
    //       .onConflict(`("id") DO UPDATE SET "title" = :title`)
    //       .setParameter("title", post2.title)
    //       .execute();
  }
}
