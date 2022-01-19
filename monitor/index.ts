import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {channelIngestionScheduler} from "./lambdas/channelIngestionScheduler";
import {userCreatedHandler} from "./lambdas/userCreatedHandler";
import {ingestChannelHandler} from "./lambdas/ingestChannelHandler";
import {videoCreatedHandler} from "./lambdas/videoCreatedHandler";
import {joystreamUploader} from "./lambdas/joystreamUploader";

// Create an AWS resource (S3 Bucket)
const schedule = new aws.cloudwatch.EventRule("everyMinute",
    {
        description:'Event is fired every hour',
        name:'everyMinute',
        scheduleExpression:'cron(0/1 * * * ? *)'
    });

const usersTable = new aws.dynamodb.Table('users',{
    name:'users',
    hashKey: 'partition',
    rangeKey:'id',
    streamEnabled: true,
    readCapacity: 1,
    writeCapacity: 1
});
schedule.onEvent('everyMinute', channelIngestionScheduler)

// topics
const userCreatedTopic = new aws.sns.Topic('userCreated')
const ingestChannelTopic = new aws.sns.Topic('ingestChannel')
const videoCreated = new aws.sns.Topic('videoCreated');

// subscriptions
userCreatedTopic.onEvent('userCreated', userCreatedHandler)
ingestChannelTopic.onEvent('ingestChannel', ingestChannelHandler)
videoCreated.onEvent('videoCreated', videoCreatedHandler)

// joystream upload queue
const uploadVideoQueue = new aws.sqs.Queue('uploadVideo')

uploadVideoQueue.onEvent('uploadVideo', joystreamUploader);
