import {TopicEvent, TopicEventHandler} from "@pulumi/aws/sns";
import {YoutubeClient} from "@youtube-sync/youtube-client";
import {User} from '@youtube-sync/domain'
import {ChannelEntity} from '@youtube-sync/database'
import {SNS} from 'aws-sdk'
import {PublishBatchRequestEntry} from "aws-sdk/clients/sns";


export async function userCreatedHandler(event: TopicEvent) {
    const client = new YoutubeClient(process.env.YOUTUBE_CLIENT_ID!, process.env.YOUTUBE_CLIENT_SECRET!, process.env.YOUTUBE_REDIRECT_URI!)
    const user = JSON.parse(event.Records[0].Sns.Message) as User
    const channels = await client.getChannels(user);
    const savedChannels = await ChannelEntity.batchPut(channels);
    // TODO: calculate frequencys
    const sns = new SNS()
    await sns.publishBatch({
        PublishBatchRequestEntries: channels.map(ch => <PublishBatchRequestEntry>{
            Subject: 'ingestChannel',
            Message: JSON.stringify(ch),
        }),
        TopicArn: 'arn:aws:sns:eu-west-1:<user-id>:channelCreated'
    }).promise()
}