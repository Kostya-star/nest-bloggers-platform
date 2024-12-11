import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersPlatformModule } from './modules/bloggers-platform';

@Module({
  imports: [BloggersPlatformModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
