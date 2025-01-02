import { configModule } from './config-dynamic-module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingAllDataModule } from './modules/testing-all-data/testing-all-data.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CoreConfig } from './core/core.config';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'admin',
      database: 'bloggers',
      autoLoadEntities: false,
      synchronize: false,
    }),
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        uri: coreConfig.mongoURI,
        dbName: coreConfig.mongoDBName,
        connectionFactory: (connection) => {
          connection.on('error', (err) => {
            console.error('Database connection error:', err);
          });
          return connection;
        },
      }),
      inject: [CoreConfig],
    }),
    BloggersPlatformModule,
    UserAccountsModule,
    NotificationsModule,
    TestingAllDataModule,
    CoreModule,
    configModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
    // const testingModule: any[] = [];
    // if (coreConfig.includeTestingModule) {
    //   testingModule.push(TestingModule);
    // }

    return {
      module: AppModule,
      // Add dynamic modules here
      // imports: testingModule
    };
  }
}
