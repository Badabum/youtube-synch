import {YoutubeClient} from "./youtubeClient";
import * as stream from "stream";
import {Video} from "./domain/Video";
import {getVideoEntity} from "./database";
import {S3} from "aws-sdk";

export class UploadService{
    constructor(private youtubeClient : YoutubeClient) {
    }
    async uploadVideo(channelId: string, videoId: string):Promise<Video>{
        const videoEntity = await getVideoEntity();
        const videoDoc = await videoEntity.get({channelId, id: videoId});
        const video:Video = <Video>videoDoc.toJSON()
        console.log('Read video entity', video)
        await videoEntity.update({id: video.id, channelId: video.channelId, state: 'uploadToJoystreamStarted'})
        const passThroughStream = new stream.PassThrough()
        this.youtubeClient
            .downloadVideo(video.url)
            .pipe(passThroughStream)
        // TODO: this is for demo purposes only, will be replaces by the upload to joystream network
        const s3 = new S3();
        const exists = await this.bucketExists(s3, channelId.toLowerCase());
        console.log("Bucket exists:", exists)
        if(!exists){
            console.log("Creating bucket", channelId.toLowerCase())
            await s3.createBucket({
                Bucket: channelId.toLowerCase(),
                ACL: 'public-read-write'
            }).promise();
        }


        const  upload = new S3.ManagedUpload({
            params: {
                Bucket: channelId.toLowerCase(),
                Key: video.title ?? video.id,
                Body: passThroughStream
            }
        });
        return await upload
            .promise()
            .then(up => videoEntity.update({id: video.id, channelId: video.channelId, state: 'uploadToJoystreamSucceded', destinationUrl: up.Location}))
            .catch(err =>{
                console.log(err);
                return videoEntity.update({id: video.id, channelId: video.channelId, state: 'uploadToJoystreamFailed'})
            })
            .then(doc => doc.toJSON() as Video);
    }
    private async bucketExists(s3:S3, channelId: string){
        try{
            await s3.headBucket({
                Bucket: channelId.toLowerCase(),
            }).promise();
            return true;
        }catch(err){
            if(err.statusCode === 404)
                return false;
            throw err;
        }
    }
}