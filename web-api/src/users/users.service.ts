import { Injectable } from '@nestjs/common';
import {google} from "googleapis";
import {User} from "@youtube-sync/domain";
import {config, DynamoDB} from "aws-sdk";
import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {randomUUID} from "crypto";

@Injectable()
export class UsersService {
    private _client: OAuth2Client
    private _documents : DocumentClient
    constructor() {
        config.update({region:'eu-west-1'});
        this._client = new google.auth.OAuth2({
            clientId:'79131856482-fo4akvhmeokn24dvfo83v61g03c6k7o0.apps.googleusercontent.com',
            clientSecret:'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',
            redirectUri:"http://localhost:3000"
        })
        this._documents = new DynamoDB.DocumentClient();
    }
    async createFromCode(code: string) : Promise<User>{
        const tokenResponse = await this._client.getToken(code);
        const tokenInfo = await this._client.getTokenInfo(tokenResponse.tokens.access_token);
        return {
            id: tokenInfo.sub,
            avatarUrl:'',
            accessToken: tokenResponse.tokens.access_token,
            refreshToken: tokenResponse.tokens.refresh_token,
            email: tokenInfo.email,
            googleId: tokenInfo.sub,
            youtubeUsername: tokenInfo.email
        }
    }
    async get(id:string) : Promise<User>{
        const response = await this._documents.get({
            TableName:'users',
            Key: {
                partition: 'users',
                id: id
            }
        }).promise();
        return response.Item as User
    }

    private async save(user: User){
        const response = await this._documents.put({
            TableName:'users',
            Item: {
                ...user,
                partition:'users'
            }
        }).promise()
    }
}
