import { Injectable } from '@nestjs/common';
import {ChannelEntity,Channel, User, YoutubeClient} from '@youtube-sync/core'
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ChannelsService {
    private youtube: YoutubeClient
    constructor(private configService: ConfigService) {
        this.youtube = new YoutubeClient(
            configService.get<string>('YOUTUBE_CLIENT_ID'),
            configService.get<string>('YOUTUBE_CLIENT_SECRET'),
            configService.get<string>('YOUTUBE_REDIRECT_URI'))
    }
    async ingest(user: User) : Promise<Channel[]>{
        const channels = await this.youtube.getChannels(user);
        await ChannelEntity.batchPut(channels)
        return channels;
    }

    async get(userId: string, id: string): Promise<Channel>{
        const channel = await ChannelEntity.query('userId').eq(userId).and().filter('id').eq(id).exec()
        return channel[0];
    }
    async getAll(userId: string):Promise<Channel[]>{
        const channels = await ChannelEntity.query('userId').eq(userId).exec();
        return channels;
    }
    async getAllWithFrequency(frequency: number):Promise<Channel[]>{
        return await ChannelEntity.scan('frequency').in([frequency]).exec();
    }
    async update(channel: Channel):Promise<Channel>{
        const updated = await ChannelEntity.update(channel);
        return updated;
    }
}
