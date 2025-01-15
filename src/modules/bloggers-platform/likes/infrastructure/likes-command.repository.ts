import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../const/like-status';
import { DataSource } from 'typeorm';

@Injectable()
export class LikesCommandRepository {
  constructor(private dataSource: DataSource) {}

  async updateLike(likedEntityId: string, status: LikeStatus, userId: number): Promise<void> {
    await this.dataSource.query(
      `
        INSERT INTO likes ("liked_entity_id", "status", "user_id")
        VALUES ($1, $2, $3)
        ON CONFLICT ("liked_entity_id", "user_id")
        DO UPDATE SET "status" = EXCLUDED."status";
      `,
      [likedEntityId, status, userId],
    );
  }
}
