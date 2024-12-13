import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  postId: string;

  @Prop({
    type: {
      userId: { type: SchemaTypes.ObjectId, required: true },
      userLogin: { type: String, required: true },
    },
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type ICommentDocument = HydratedDocument<Comment>;
export type ICommentModel = Model<Comment>;
