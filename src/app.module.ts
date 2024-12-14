import { Module } from '@nestjs/common';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TestingAllDataModule } from './modules/testing-all-data/testing-all-data.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    BloggersPlatformModule,
    UserAccountsModule,
    TestingAllDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
