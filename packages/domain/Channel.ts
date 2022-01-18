

export interface Channel {
    id: string,
    title: string,
    frequency: number,
    description: string,
    userId: string,
    createdAt: number,
    thumbnails: {
        default: string,
        medium: string,
        high: string,
        maxRes: string,
        standard: string
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