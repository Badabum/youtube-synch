import {QueueEvent} from "@pulumi/aws/sqs";
import {Video} from "@youtube-sync/domain";

export function joystreamUploader(event: QueueEvent){
    const video:Video = JSON.parse(event.Records[0].body)
}