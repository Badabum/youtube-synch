import {EventRuleEvent} from "@pulumi/aws/cloudwatch";
import {Events, Channel} from "../core/domain"
import IngestChannel = Events.IngestChannel;
import {PublishBatchRequestEntry} from "aws-sdk/clients/sns";
import {getChannelEntity} from "../core/database";

export async function channelIngestionScheduler(event: EventRuleEvent){
    const dynamoose = await import('dynamoose')
    const{SNS} = await import("aws-sdk");
    const channelEntity = await getChannelEntity()
    const matchingFrequencies = getMatchingFrequencies(getEventMinutes(event))
    console.log(matchingFrequencies)
    // fetch all channels with frequency matching
    const rawChannels = await channelEntity.scan('frequency').in([0]).exec()
    const channels = rawChannels.map(ch => ch.toJSON() as Channel)
    console.log("Found channels", channels);
    const events = channels
        .map(channel => <IngestChannel>{channel, timestamp: Date.now()})
        .map(evt => JSON.stringify(evt))
    const sns = new SNS();
    console.log("Publising events", events)
    const promises = events.map(event => sns.publish({
        Message: event,
        Subject: 'ingestChannels',
        TopicArn: 'arn:aws:sns:eu-west-1:226498669520:channelEvents-ce73cba'
    }).promise());
    await Promise.all(promises)
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
