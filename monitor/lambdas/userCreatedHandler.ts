import {TopicEvent} from "@pulumi/aws/sns";
import {SNS} from 'aws-sdk'
import {PublishBatchRequestEntry} from "aws-sdk/clients/sns";
import {Channel, Events} from "../core/domain";
import UserCreated = Events.UserCreated;
import IngestChannel = Events.IngestChannel;
import {YoutubeClient} from "../core/youtubeClient";
import {getChannelEntity} from "../core/database";

export async function userCreatedHandler(event: TopicEvent) {
    const channelEntity = await getChannelEntity();
    const client  = new YoutubeClient('79131856482-fo4akvhmeokn24dvfo83v61g03c6k7o0.apps.googleusercontent.com',
        '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','http://localhost:3000');
    const userCreated = <UserCreated>JSON.parse(event.Records[0].Sns.Message)
    const channels:Channel[] = await client.getChannels(userCreated.user);
    const savedChannels = await channelEntity.batchPut(channels);
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
        TopicArn: 'arn:aws:sns:eu-west-1:226498669520:userEvents-0cbafaa'
    }).promise()
}