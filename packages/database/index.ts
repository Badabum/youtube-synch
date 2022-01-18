import {User, Channel, Video, VideoState} from '@youtube-sync/domain'
import * as dynamoose from 'dynamoose'
import {Document} from 'dynamoose/dist/Document'

const userSchema = new dynamoose.Schema({
    id: {
        type: String,
        rangeKey: true,
    },
    partition: {
        type: String,
        hashKey: true,
    },
    email: String,
    youtubeUsername: String,
    googleId: String,
    accessToken: String,
    refreshToken: String,
    avatarUrl: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})
class UserDocument extends Document implements User{
    accessToken: string;
    avatarUrl: string;
    email: string;
    googleId: string;
    id: string;
    refreshToken: string;
    youtubeUsername: string;
    partition: string;
}

const UserEntity = dynamoose.model<UserDocument>('user', userSchema, {
    create: true
})

const channelSchema = new dynamoose.Schema({
    id: {
        type: String,
        rangeKey: true,
    },
    title: String,
    frequency: Number,
    description: String,
    userId: {
        hashKey: true,
        type: String,
    },
    createdAt: Number,
    thumbnails: {
        type: Object,
        schema: {
            default: String,
            medium: String,
            high: String,
            maxRes: String,
            standard: String
        }
    },
    statistics: {
        type: Object,
        schema:{
            viewCount: Number,
            commentCount: Number,
            subscriberCount: Number,
            videoCount: Number
        }
    },
    userAccessToken: String,
    userRefreshToken: String,
    uploadsPlaylistId: String
})
class ChannelDocument extends Document implements Channel{
    createdAt: number;
    description: string;
    frequency: number;
    id: string;
    statistics: { viewCount: number; commentCount: number; subscriberCount: number; videoCount: number };
    thumbnails: { default: string; medium: string; high: string; maxRes: string; standard: string };
    title: string;
    uploadsPlaylistId: string;
    userAccessToken: string;
    userId: string;
    userRefreshToken: string;
}
const ChannelEntity = dynamoose.model<ChannelDocument>('channel', channelSchema)

const videoSchema = new dynamoose.Schema({
    url: String,
    title: String,
    description: String,
    channelId: {
      type: String,
      hashKey: true
    },
    id: {
        type: String,
        rangeKey: true
    },
    playlistId: String,
    resourceId: String,
    thumbnails:{
        type: Object,
        schema: {
            default: String,
            medium: String,
            high: String,
            maxRes: String,
            standard: String
        }
    },
    state: {
        type: String,
        enum: ["new","downloadStarted"
        , "downloadFailed"
        , "downloadSucceded"
        , "uploadToJoystreamStarted"
        , "uploadToJoystreamFailed"
        , "uploadToJoystreamSucceded"]
    },
}, {
    timestamps:{
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})
class VideoDocument extends Document implements Video{
    createdAt: number;
    description: string;
    id: string;
    playlistId: string;
    resourceId: string;
    channelId: string;
    state: VideoState;
    thumbnails: { default: string; medium: string; high: string; maxRes: string; standard: string };
    title: string;
    url: string;
}
const VideoEntity = dynamoose.model<VideoDocument>('video', videoSchema)
export {VideoEntity, ChannelEntity, UserEntity, UserDocument, ChannelDocument, VideoDocument, dynamoose}