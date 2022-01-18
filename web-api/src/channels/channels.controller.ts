import {Controller, Get, Param, Post} from '@nestjs/common';
import {ChannelsService} from "./channels.service";
import {VideosService} from "../videos/videos.service";

@Controller({path:'users/:userId/channels'})
export class ChannelsController {
    constructor(private channelsService: ChannelsService, private videosService: VideosService) {
    }

    @Get(':id')
    async get(
        @Param('userId') userId: string,
        @Param('id') id: string){
        const channel = await this.channelsService.get(userId, id)
        return channel;
    }
    @Get()
    async getAll(@Param('userId') userId:string){
        return this.channelsService.getAll(userId);
    }

    @Post(':id/videos/ingest')
    async ingestVideos(@Param('id') id: string, @Param('userId') userId:string){
        const channel = await this.channelsService.get(userId, id);
        const videos = await this.videosService.ingest(channel);
        return videos;
    }
}
