import {TopicEvent} from "@pulumi/aws/sns";
import {YoutubeClient, UploadService, Events, Video, dynamoose} from "@youtube-sync/core";
import VideoEvent = Events.VideoEvent;

export async function videoCreatedHandler(event: TopicEvent){
    const core = require('@youtube-sync/core');
    const videoCreated:VideoEvent = JSON.parse(event.Records[0].Sns.Message);
    if(videoCreated.state !== 'new') // only handle video when it was created
        return;
    const uploadService = new core.UploadService(new YoutubeClient('','',''))
    await uploadService.uploadVideo(videoCreated.channelId, videoCreated.videoId)
}

export async function videoStateLogger(event: TopicEvent){
    const core = require('@youtube-sync/core');
    const videoEvent: VideoEvent = JSON.parse(event.Records[0].Sns.Message);
    await core.VideoStateEntity.update(videoEvent);
}