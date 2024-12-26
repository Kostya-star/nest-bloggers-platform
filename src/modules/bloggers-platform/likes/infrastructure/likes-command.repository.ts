import { InjectModel } from '@nestjs/mongoose';
import { ILikeModel, Like } from '../domain/likes.schema';
import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../const/like-status';

@Injectable()
export class LikesCommandRepository {
  constructor(@InjectModel(Like.name) private LikeModel: ILikeModel) {}

  async updateLike(likedEntityId: string, status: LikeStatus, userId: string, userLogin: string): Promise<void> {
    await this.LikeModel.findOneAndUpdate(
      { userId, likedEntityId, userLogin },
      { likedEntityId, userId, status, userLogin },
      { upsert: true },
    );
  }
}
