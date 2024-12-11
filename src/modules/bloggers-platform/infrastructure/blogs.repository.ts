import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  testRepo() {
    return 'blogs repo test';
  }
}
