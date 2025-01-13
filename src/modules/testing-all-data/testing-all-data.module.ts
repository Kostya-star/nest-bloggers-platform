import { Module } from '@nestjs/common';
import { TestingAllDataController } from './controller';

@Module({
  imports: [],
  controllers: [TestingAllDataController],
  providers: [],
})
export class TestingAllDataModule {}
