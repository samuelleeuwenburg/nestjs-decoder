import { Controller, Get, Post, Body } from '@nestjs/common';
import { Codec, GetType, number, string } from 'purify-ts/Codec';

const User = Codec.interface({
  username: string,
  age: number,
});

type User = GetType<typeof User>;

@Controller('/user')
export class AppController {
  constructor() {}

  @Get()
  getHello(): User {
    return { username: 'foo', age: 60 };
  }

  @Post()
  sendUser(@Body() user: User) {
    return `hello ${user.username}, you are ${user.age} old \n`;
  }
}
