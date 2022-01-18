
export type VideoState = "new"
    | "downloadStarted"
    | "downloadFailed"
    | "downloadSucceded"
    | "uploadToJoystreamStarted"
    | "uploadToJoystreamFailed"
    | "uploadToJoystreamSucceded"
export interface Video{
    url: string,
    title: string,
    description: string,
    id: string,
    playlistId: string,
    resourceId: string;
    channelId: string,
    thumbnails:{
        default: string,
        medium: string,
        high: string,
        maxRes: string,
        standard: string
    },
    state: VideoState,
    createdAt: number
}