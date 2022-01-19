import {TopicEvent} from "@pulumi/aws/sns";
import {YoutubeClient, UploadService, Events, Video} from "@youtube-sync/core";
import VideoEvent = Events.VideoEvent;

export async function videoCreatedHandler(event: TopicEvent){
    const videoCreated:VideoEvent = JSON.parse(event.Records[0].Sns.Message);
    if(videoCreated.state !== 'new') // only handle video when it was created
        return;
    const uploadService = new UploadService(new YoutubeClient('','',''))
    await uploadService.uploadVideo(videoCreated.channelId, videoCreated.videoId)
}