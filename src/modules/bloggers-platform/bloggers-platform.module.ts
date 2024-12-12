import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.schema';
import { BlogsQueryRepository } from './infrastructure/blogs-query.repository';
import { BlogsCommandsRepository } from './infrastructure/blogs-commands.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsCommandsRepository, BlogsQueryRepository],
  exports: [],
})
export class BloggersPlatformModule {}
