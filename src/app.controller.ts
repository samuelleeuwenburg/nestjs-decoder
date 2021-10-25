import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { Codec, GetType, number, string } from 'purify-ts/Codec';

const User = Codec.interface({
  username: string,
  age: number,
});

type User = GetType<typeof User>;

const Decode =
  <T>(codec: Codec<T>) =>
  (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<Fn<T>>,
  ) => {
    const value = descriptor.value!;

    (descriptor as any).value = function (argument: T) {
      try {
        return value.call(this, codec.unsafeDecode(argument));
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    };
  };

type Fn<T> = (x: T) => void;

@Controller('/user')
export class AppController {
  @Get()
  getHello(): User {
    return { username: 'foo', age: 60 };
  }

  @Post()
  @Decode(User)
  sendUser(@Body() user: User) {
    return `hello ${user.username}, you are ${user.age} old \n`;
  }
}
