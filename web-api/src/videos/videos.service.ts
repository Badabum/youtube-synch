import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {Channel, Video, YoutubeClient, VideoEntity} from "@youtube-sync/core";

@Injectable()
export class VideosService {
    private youtube : YoutubeClient
    constructor(private configService: ConfigService) {
        this.youtube = new YoutubeClient(
            configService.get<string>('YOUTUBE_CLIENT_ID'),
            configService.get<string>('YOUTUBE_CLIENT_SECRET'),
            configService.get<string>('YOUTUBE_REDIRECT_URI'))
    }

    async ingest(channel: Channel): Promise<Video[]>{
        const videos = await this.youtube.getAllVideos(channel);
        await VideoEntity.batchPut(videos);
        return videos;
    }
    async getVideos(channel: Channel):Promise<Video[]>{
        return await VideoEntity.query('channelId').eq(channel.id).exec();
    }
}
