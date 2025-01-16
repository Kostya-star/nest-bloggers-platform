import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../const/like-status';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../domain/likes.schema-typeorm';

@Injectable()
export class LikesCommandRepository {
  constructor(@InjectRepository(Like) private likesRepository: Repository<Like>) {}

  async updateLike(likedEntityId: number, status: LikeStatus, userId: number): Promise<void> {
    // await this.dataSource.query(
    //   `
    //     INSERT INTO likes ("liked_entity_id", "status", "user_id")
    //     VALUES ($1, $2, $3)
    //     ON CONFLICT ("liked_entity_id", "user_id")
    //     DO UPDATE SET "status" = EXCLUDED."status";
    //   `,
    //   [likedEntityId, status, userId],
    // );

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
