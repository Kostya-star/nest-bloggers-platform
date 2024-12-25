import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export const blogNameConstraints = {
  maxLength: 15,
};

export const blogDescriptionConstraints = {
  maxLength: 500,
};

export const blogWebsiteUrlConstraints = {
  match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  maxLength: 100,
};

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, required: true, ...blogNameConstraints })
  name: string;

  @Prop({ type: String, required: true, ...blogDescriptionConstraints })
  description: string;

  @Prop({ type: String, required: true, ...blogWebsiteUrlConstraints })
  websiteUrl: string;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type IBlogDocument = HydratedDocument<Blog>;
export type IBlogModel = Model<Blog>;
