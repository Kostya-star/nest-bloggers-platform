import { Controller, Get } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get()
  testController() {
    return this.blogsService.testService()
  }
}
