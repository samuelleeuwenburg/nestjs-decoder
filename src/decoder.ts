import { Codec } from 'purify-ts/Codec';
import { BadRequestException } from '@nestjs/common';
import { Maybe } from 'purify-ts';

export function Decode<
  A = undefined,
  B = undefined,
  C = undefined,
  D = undefined,
  E = undefined,
>(
  a: A extends undefined ? undefined : Codec<A>,
  b?: B extends undefined ? undefined : Codec<B>,
  c?: C extends undefined ? undefined : Codec<C>,
  d?: D extends undefined ? undefined : Codec<D>,
  e?: E extends undefined ? undefined : Codec<E>,
) {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<Fn<A, B, C, D, E>>,
  ): void => {
    const originalValue = descriptor.value;

    descriptor.value = function (...[argA, argB, argC, argD, argE, ...rest]) {
      try {
        const args = [
          Maybe.fromNullable(a)
            .map((codec) => codec.unsafeDecode(argA))
            .orDefault(argA as any),
          Maybe.fromNullable(b)
            .map((codec) => codec.unsafeDecode(argB))
            .orDefault(argB as any),
          Maybe.fromNullable(c)
            .map((codec) => codec.unsafeDecode(argC))
            .orDefault(argC as any),
          Maybe.fromNullable(d)
            .map((codec) => codec.unsafeDecode(argD))
            .orDefault(argD as any),
          Maybe.fromNullable(e)
            .map((codec) => codec.unsafeDecode(argE))
            .orDefault(argE as any),
          ...rest,
        ];
        return originalValue?.apply(originalValue, args);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    };
  };
}

type Fn<A, B, C, D, E> = (
  a: A extends undefined ? any : A,
  b: B extends undefined ? any : B,
  c: C extends undefined ? any : C,
  d: D extends undefined ? any : D,
  e: E extends undefined ? any : E,
  ...args
) => void;
