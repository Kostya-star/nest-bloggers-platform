import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export const postTitleConstraints = {
  maxLength: 30,
};

export const postDescriptionConstraints = {
  maxLength: 100,
};

export const postContentConstraints = {
  maxLength: 1000,
};

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true, ...postTitleConstraints })
  title: string;

  @Prop({ type: String, required: true, ...postDescriptionConstraints })
  shortDescription: string;

  @Prop({ type: String, required: true, ...postContentConstraints })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type IPostDocument = HydratedDocument<Post>;
export type IPostModel = Model<Post>;
