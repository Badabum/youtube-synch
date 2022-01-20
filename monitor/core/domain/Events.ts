import {User} from "./User";
import {Channel} from "./Channel";
import {VideoState} from "./Video";

export namespace Events{
    export interface IngestChannel{
        channel: Channel,
        timestamp: number
    }
    export interface UserCreated{
        user: User,
        timestamp: number,
    }
    export interface VideoEvent{
        state: VideoState,
        videoId: string,
        channelId: string,
        timestamp: number
    }
}