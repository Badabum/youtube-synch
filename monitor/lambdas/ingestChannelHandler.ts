import {TopicEvent} from "@pulumi/aws/sns";
import {Channel, Events, Video} from "../core/domain";
import VideoEvent = Events.VideoEvent;
import {YoutubeClient} from "../core/youtubeClient";
import {getVideoEntity} from "../core/database";
import IngestChannel = Events.IngestChannel;

export async function ingestChannelHandler(event: TopicEvent){
    const videoEntity = await getVideoEntity()
    const{SNS} = await import("aws-sdk");
    const youtubeClient = new YoutubeClient('79131856482-fo4akvhmeokn24dvfo83v61g03c6k7o0.apps.googleusercontent.com',
        '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','http://localhost:3000');
    const message : IngestChannel = JSON.parse(event.Records[0].Sns.Message);
    console.log("Got message: ", message);
    const videos:Video[] = await youtubeClient.getVideos(message.channel, 50);
    console.log("Got videos", videos)
    await videoEntity.batchPut(videos);
    const sns = new SNS();
    const promises = videos.map(video => sns.publish({
        Subject: 'videoCreated',
        Message: JSON.stringify(<VideoEvent>{
            channelId: video.channelId,
            videoId: video.id,
            state: 'new',
            timestamp: Date.now()
        }),
        TopicArn: 'arn:aws:sns:eu-west-1:226498669520:videoEvents-137f223'
    }).promise());
    await Promise.all(promises)
}