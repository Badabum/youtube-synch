import {TopicEvent} from "@pulumi/aws/sns";
import {UploadService} from "../core/uploadService";
import {getVideoStateEntity} from "../core/database";
import {YoutubeClient} from "../core/youtubeClient";
import {Events} from "../core/domain";

export async function videoCreatedHandler(event: TopicEvent){
    const videoCreated:Events.VideoEvent = JSON.parse(event.Records[0].Sns.Message);
    if(videoCreated.state !== 'new') // only handle video when it was created
        return;
    console.log('New video', videoCreated)
    const uploadService = new UploadService(new YoutubeClient('79131856482-fo4akvhmeokn24dvfo83v61g03c6k7o0.apps.googleusercontent.com',
        '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','http://localhost:3000'))
    await uploadService.uploadVideo(videoCreated.channelId, videoCreated.videoId)
}

export async function videoStateLogger(event: TopicEvent){
    const videoEvent: Events.VideoEvent = JSON.parse(event.Records[0].Sns.Message);
    const videoStateEntity = await getVideoStateEntity()
    await videoStateEntity.update(videoEvent);
}