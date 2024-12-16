import { Module } from '@nestjs/common';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TestingAllDataModule } from './modules/testing-all-data/testing-all-data.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || '', {
      dbName: 'incubator-blogs',
    }),
    BloggersPlatformModule,
    UserAccountsModule,
    NotificationsModule,
    TestingAllDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
