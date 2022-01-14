import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {User} from "@youtube-sync/domain";
import {google} from 'googleapis'
import {config, Config, DynamoDB} from 'aws-sdk'
import {UsersService} from "./users.service";

interface UserCreateRequest{
    authorizationCode: string
}
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {
    }
    @Post()
    async create(@Body() request: UserCreateRequest) : Promise<User>{
        const user = this.userService.createFromCode(request.authorizationCode);
        return user;
    }
    @Get(':id')
    async get(@Param('id') id: string) : Promise<User>{
        return this.userService.get(id);
    }
    @Get()
    async find(@Query('search') search: string) : Promise<User[]>{
        return []; //TODO: implementation
    }
}
