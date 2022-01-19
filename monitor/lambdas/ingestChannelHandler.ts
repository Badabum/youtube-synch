import {TopicEvent} from "@pulumi/aws/sns";
import {Channel, dynamoose, Events, Video} from "@youtube-sync/core";
import {SNS} from "aws-sdk";
import {PublishBatchRequestEntry} from "aws-sdk/clients/sns";
import VideoEvent = Events.VideoEvent;

export async function ingestChannelHandler(event: TopicEvent){
    dynamoose.aws.sdk.config.update({region:'eu-west-1'});
    const sns = new SNS();
    const core = require('@youtube-sync/core')
    const youtubeClient = new core.YoutubeClient('','','');
    const message : Channel = JSON.parse(event.Records[0].Sns.Message);
    const videos:Video[] = await youtubeClient.getVideos(message, 50);
    await core.VideoEntity.batchPut(videos);
    await sns.publishBatch({
        PublishBatchRequestEntries: videos.map(video => <PublishBatchRequestEntry>{
            Subject: 'videoCreated',
            Message: JSON.stringify(<VideoEvent>{
                channelId: video.channelId,
                videoId: video.id,
                state: 'new',
                timestamp: Date.now()
            })
        }),
        TopicArn: 'arn:aws:sns:eu-west-1:<user-id>:videoCreated'
    }).promise()
}