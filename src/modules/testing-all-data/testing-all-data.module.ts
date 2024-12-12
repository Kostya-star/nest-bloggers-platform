import { Module } from '@nestjs/common';
import { TestingAllDataController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../bloggers-platform/domain/blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [TestingAllDataController],
  providers: [],
})
export class TestingAllDataModule {}
