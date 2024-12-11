import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsService } from './application/blogs.service';

@Module({
  imports: [],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository]
})

export class BloggersPlatformModule {}
