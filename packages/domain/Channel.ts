export interface Channel {
    id: string,
    title: string,
    frequency: number,
    description: string,
    userId: string,
    createdAt: number,
    thumbnails: {
        small: string,
        large: string,
        medium: string
    },
    statistics: {
        viewCount: number,
        commentCount: number,
        subscriberCount: number,
        videoCount: number
    },
    userAccessToken: string,
    userRefreshToken: string,
    uploadsPlaylistId: string
}