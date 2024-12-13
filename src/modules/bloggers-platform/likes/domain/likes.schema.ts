import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { LikeStatus } from './likes-status';

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: String, enum: LikeStatus, required: true })
  status: LikeStatus;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  likedEntityId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userLogin: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

export type ILikeDocument = HydratedDocument<Like>;
export type ILikeModel = Model<Like>;
