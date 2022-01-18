import {TopicEvent} from "@pulumi/aws/sns";
import {Channel} from '@youtube-sync/domain'
import {YoutubeClient} from "@youtube-sync/youtube-client";
import {VideoEntity} from '@youtube-sync/database'
import {SNS} from "aws-sdk";
import {PublishBatchRequestEntry} from "aws-sdk/clients/sns";

export async function ingestChannelHandler(event: TopicEvent){
    const sns = new SNS();
    const youtubeClient = new YoutubeClient('','','');
    const message : Channel = JSON.parse(event.Records[0].Sns.Message);
    const videos = await youtubeClient.getVideos(message, 50);
    await VideoEntity.batchPut(videos);
    await sns.publishBatch({
        PublishBatchRequestEntries: videos.map(video => <PublishBatchRequestEntry>{
            Subject: 'videoCreated',
            Message: JSON.stringify(video)
        }),
        TopicArn: 'arn:aws:sns:eu-west-1:<user-id>:videoCreated'
    }).promise()
}