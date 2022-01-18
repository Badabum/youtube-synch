import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ChannelsService } from './channels/channels.service';
import {ConfigModule} from "@nestjs/config";
import { VideosService } from './videos/videos.service';
import { ChannelsController } from './channels/channels.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UsersController, ChannelsController],
  providers: [UsersService, ChannelsService, VideosService],
})
export class AppModule {}
