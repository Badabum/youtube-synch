import {EventRuleEvent} from "@pulumi/aws/cloudwatch";
import {Events, ChannelEntity, dynamoose} from "@youtube-sync/core";
import IngestChannel = Events.IngestChannel;
import {SNS} from "aws-sdk";
import {PublishBatchRequestEntry} from "aws-sdk/clients/sns";


export function channelIngestionScheduler(event: EventRuleEvent){
    const matchingFrequencies = getMatchingFrequencies(getEventMinutes(event))
    // fetch all channels with frequency matching
    const channels = await ChannelEntity.query(new dynamoose.Condition().filter('frequency').in(matchingFrequencies)).exec()

    const events = channels.map(channel => <IngestChannel>{channel, timestamp: Date.now()})
    await new SNS()
        .publishBatch({
            PublishBatchRequestEntries: events.map(evt => <PublishBatchRequestEntry>{
                Message: JSON.stringify(evt),
                Subject: 'ingestChannels'
            }),
            TopicArn: 'arn:aws:sns:eu-west-1:<user-id>:ingestChannel'
        }).promise();
}

function getEventMinutes(event: EventRuleEvent){
    const fireDateTime = new Date(event.time)
    const hours = fireDateTime.getUTCHours();
    const minutes = fireDateTime.getUTCMinutes();
    return 60*hours + minutes;
}

function getMatchingFrequencies(minutes: number) : number[]{
    const allFrequencies = [1,10,30,60,120,180, 360, 720, 1440];
    return allFrequencies.filter(f => f % minutes === 0);
}
