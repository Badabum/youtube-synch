import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {User} from "@youtube-sync/core";
import {UsersService} from "./users.service";
import {ChannelsService} from "../channels/channels.service";

interface UserCreateRequest{
    authorizationCode: string
}
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService, private channelsService: ChannelsService) {
    }
    @Post()
    async create(@Body() request: UserCreateRequest) : Promise<User>{
        const user = await this.userService.createFromCode(request.authorizationCode);
        const channels = await this.channelsService.ingest(user);
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
