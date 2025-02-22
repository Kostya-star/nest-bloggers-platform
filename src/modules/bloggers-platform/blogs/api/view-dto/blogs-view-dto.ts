import { Blog } from '../../domain/blogs.schema-typeorm';

export class BlogsViewDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  constructor(blog: Blog) {
    this.id = blog.id.toString();
    this.name = blog.name;
    this.description = blog.description;
    this.websiteUrl = blog.websiteUrl;
    this.isMembership = blog.isMembership;
    this.createdAt = blog.createdAt;
  }
}
