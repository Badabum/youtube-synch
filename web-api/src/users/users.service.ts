import { Injectable } from '@nestjs/common';
import {google} from "googleapis";
import {User} from "@youtube-sync/core";
import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";
import {UserEntity} from '@youtube-sync/core'
import {ConfigService} from "@nestjs/config";
@Injectable()
export class UsersService {
    private _client: OAuth2Client
    constructor(private configService:ConfigService) {
        this._client = new google.auth.OAuth2({
            clientId: configService.get<string>('YOUTUBE_CLIENT_ID'),
            clientSecret: configService.get<string>('YOUTUBE_CLIENT_SECRET'),
            redirectUri: configService.get<string>('YOUTUBE_REDIRECT_URI')
        })
    }
    async createFromCode(code: string) : Promise<User>{
        const tokenResponse = await this._client.getToken(code);
        const tokenInfo = await this._client.getTokenInfo(tokenResponse.tokens.access_token);
        const user: User = {
            id: tokenInfo.sub,
            avatarUrl:'',
            accessToken: tokenResponse.tokens.access_token,
            refreshToken: tokenResponse.tokens.refresh_token,
            email: tokenInfo.email,
            googleId: tokenInfo.sub,
            youtubeUsername: tokenInfo.email
        }
        return await UserEntity.update({...user, partition: 'users'});
    }
    async get(id:string) : Promise<User>{
       return await UserEntity.get({partition:'users', id:id})
    }
}
