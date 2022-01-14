import {User} from "./User";

export namespace Events{
    export interface UserCreated{
        user: User,
        timestamp: number,
    }

    export interface VideoCreated{
        videoId: string,
        timestamp: number
    }
    export interface VideoEvent{
        videoId: string
        timestamp: string
    }
    export interface VideoDownloadStarted extends VideoEvent{}
    export interface VideoDownloadFailed extends VideoEvent{}
    export interface VideoDownloadSucceeded extends VideoEvent{}

    export interface VideoUploadToJoystreamStarted extends VideoEvent{
    }
    export interface VideoUploadToJoystreamFailed extends VideoEvent{
        reason: string
    }
    export interface VideoUploadToJoystreamSucceded extends VideoEvent{
    }
}
