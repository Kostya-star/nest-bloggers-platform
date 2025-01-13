import { Controller, Delete, HttpCode } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(private dataSource: DataSource) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.dataSource.query(`
        DELETE FROM users
      `);

    await this.dataSource.query(`
        DELETE FROM devices
      `);

    await this.dataSource.query(`
        DELETE FROM blogs
      `);

    await this.dataSource.query(`
        DELETE FROM posts
      `);

    await this.dataSource.query(`
        DELETE FROM likes
      `);

    await this.dataSource.query(`
        DELETE FROM comments
      `);
  }
}
