import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingAllDataModule } from './modules/testing-all-data/testing-all-data.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
        connectionFactory: (connection) => {
          connection.on('error', (err) => {
            console.error('Database connection error:', err);
          });
          return connection;
        },
      }),
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
