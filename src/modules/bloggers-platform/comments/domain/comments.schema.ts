import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTypes } from 'mongoose';

export const commentContentConstraints = {
  minLength: 20,
  maxLength: 300,
};

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true, ...commentContentConstraints })
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  postId: string;

  @Prop({
    type: {
      // __ASK__ what if we keep String instead of SchemaTypes.ObjectId in DB coz to my experience
      // it's more convenient to work with strings and less error-prone, for ex with 403 forbidden errors
      // and coz of that and coz of many other reasons as i can see, in general, mongoose sucks
      userId: { type: SchemaTypes.ObjectId, required: true },
      userLogin: { type: String, required: true },
      _id: false,
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
