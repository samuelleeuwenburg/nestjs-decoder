import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Codec, GetType, number, string } from 'purify-ts/Codec';
import { Decode } from './decoder';

const filterDecoder = Codec.interface({
  name: string,
  size: string,
});
type Filter = GetType<typeof filterDecoder>;

const userDecoder = Codec.interface({
  username: string,
  age: number,
});

type User = GetType<typeof userDecoder>;

@Controller('/user')
export class AppController {
  @Get()
  @Decode(filterDecoder, undefined, userDecoder)
  getHello(@Query() filter: Filter, foo: string, @Body() user: User) {
    return `These is your filter: ${filter.name} size: ${filter.size}`;
  }

  @Post()
  @Decode(userDecoder)
  sendUser(@Body() user: User) {
    return `hello ${user.username}, you are ${user.age} old \n`;
  }
}
