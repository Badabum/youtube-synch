import {YoutubeClient} from "./youtubeClient";
import * as stream from "stream";
import {S3} from 'aws-sdk'
import {Video} from "./domain/Video";
import {VideoEntity} from "./database";

export class UploadService{
    constructor(private youtubeClient : YoutubeClient) {
    }
    async uploadVideo(channelId: string, videoId: string):Promise<Video>{
        const video = await VideoEntity.get({channelId, id: videoId})
        await VideoEntity.update({...video, state: 'uploadToJoystreamStarted'})
        const passThroughStream = new stream.PassThrough()
        this.youtubeClient
            .downloadVideo(video.url)
            .pipe(passThroughStream)
        // TODO: this is for demo purposes only, will be replaces by the upload to joystream network
        const  upload = new S3.ManagedUpload({
            params: {
                Bucket: channelId,
                Key: video.title ?? video.id,
                Body: passThroughStream
            }
        });
        return await upload
            .promise()
            .then(up => VideoEntity.update({...video, state: 'uploadToJoystreamSucceded', destinationUrl: up.Location}))
            .catch(err => VideoEntity.update({...video, state: 'uploadToJoystreamFailed'}))
    }
}