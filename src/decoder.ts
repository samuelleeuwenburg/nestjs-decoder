import { Codec, string } from 'purify-ts/Codec';
import { BadRequestException } from '@nestjs/common';

export const Decode =
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

type Fn<T> = (x: T, ...args) => void;
