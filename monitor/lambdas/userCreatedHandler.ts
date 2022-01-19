import {TopicEvent} from "@pulumi/aws/sns";
import {SNS} from 'aws-sdk'
import {PublishBatchRequestEntry} from "aws-sdk/clients/sns";
import {Channel, Events} from "@youtube-sync/core";
import UserCreated = Events.UserCreated;
import IngestChannel = Events.IngestChannel;

export async function userCreatedHandler(event: TopicEvent) {
    const core = require('@youtube-sync/core')
    const client = new core.YoutubeClient(process.env.YOUTUBE_CLIENT_ID!, process.env.YOUTUBE_CLIENT_SECRET!, process.env.YOUTUBE_REDIRECT_URI!)
    const userCreated = <UserCreated>JSON.parse(event.Records[0].Sns.Message)
    const channels:Channel[] = await client.getChannels(userCreated.user);
    const savedChannels = await core.ChannelEntity.batchPut(channels);
    // TODO: calculate frequencies
    const sns = new SNS()
    await sns.publishBatch({
        PublishBatchRequestEntries: channels.map(ch => <PublishBatchRequestEntry>{
            Subject: 'ingestChannel',
            Message: JSON.stringify(<IngestChannel>{
                channel: ch,
                timestamp: Date.now()
            }),
        }),
        TopicArn: 'arn:aws:sns:eu-west-1:<user-id>:channelCreated'
    }).promise()
}