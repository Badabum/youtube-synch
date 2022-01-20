


export async function getVideoEntity(){
    const dynamoose = await import('dynamoose')
    dynamoose.aws.sdk.config.update({region:'eu-west-1'});
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
            enum: ["new"
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
    return dynamoose.model('video', videoSchema)
}
export async function getChannelEntity(){
    const dynamoose = await import('dynamoose')
    dynamoose.aws.sdk.config.update({region:'eu-west-1'});
    const channelSchema = new dynamoose.Schema({
        id: {
            type: String,
            rangeKey: true,
        },
        title: String,
        frequency: {
            type: Number,
            index:{
                global: true,
                rangeKey: 'id',
                name: "frequency-id-index"
            }
        },
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
    return dynamoose.model('channel', channelSchema)
}

export async function getUserEntity(){
    const dynamoose = await import('dynamoose')
    dynamoose.aws.sdk.config.update({region:'eu-west-1'});
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
    return dynamoose.model('user', userSchema)
}

export async function getVideoStateEntity(){
    const dynamoose = await import('dynamoose')
    dynamoose.aws.sdk.config.update({region:'eu-west-1'});
    const videoStateSchema = new dynamoose.Schema({
        videoId: String,
        channelId: String,
        reason: String,
        state: {
            type: String,
            enum: ["new"
                , "uploadToJoystreamStarted"
                , "uploadToJoystreamFailed"
                , "uploadToJoystreamSucceded"]
        }
    },{timestamps:{
            createdAt: 'loggedAt'
        }});
    return dynamoose.model('videoStateLogs', videoStateSchema)
}