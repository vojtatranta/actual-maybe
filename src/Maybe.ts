type NonNullableMaybe<T, D = never> = T extends Maybe<infer U>
  ? U extends null | undefined
    ? D
    : Maybe<U>
  : D;
type UnpackedMaybe<T> = T extends Maybe<infer U> ? U : T;
type Last<T extends any[] | readonly any[]> = T extends [...infer Rest, infer L]
  ? L
  : never;

export class Maybe<T> {
  private value: T | null | undefined;

  constructor(value: T | null | undefined) {
    this.value = value;
  }

  static of<NV>(value: NV | null | undefined) {
    return new Maybe<NV>(value);
  }

  static asMaybeInput<NV, R>(
    callback: (input: Maybe<NV>) => R
  ): (externalInput: NV) => R {
    return (externalInput: NV): R => callback(Maybe.of<NV>(externalInput));
  }

  static asInput<NV, R>(
    callback: (input: NonNullable<NV>) => R
  ): (externalInput: NV) => Maybe<R> {
    return (externalInput: NV): Maybe<R> =>
      Maybe.of<NV>(externalInput).map(callback);
  }

  static all<T extends unknown[]>(
    maybies: [...T]
  ): Maybe<{ -readonly [P in keyof T]: UnpackedMaybe<T[P]> }> {
    const results: unknown[] = [];

    const allMaybies = maybies.map((value) =>
      value instanceof Maybe ? value : Maybe.of(value)
    );
    allMaybies.forEach((maybeValue) =>
      maybeValue.map((truthyValue) => {
        results.push(truthyValue);
      })
    );

    if (results.length === maybies.length) {
      return Maybe.of(results) as Maybe<{
        -readonly [P in keyof T]: UnpackedMaybe<T[P]>;
      }>;
    }

    return Maybe.of(
      null as unknown as { -readonly [P in keyof T]: UnpackedMaybe<T[P]> }
    );
  }

  static fromFirst<T extends any[] | readonly any[]>(
    someArray: T | null | undefined
  ): Maybe<T[0]> {
    return Maybe.fromNth<T, 0>(someArray, 0);
  }

  static fromLast<T extends any[] | readonly any[]>(
    someArray: T | null | undefined
  ): Maybe<Last<T>> {
    return Maybe.fromNth(someArray, (someArray?.length ?? 0) - 1);
  }

  static fromNth<T extends any[] | readonly any[], N extends number>(
    someArray: T | null | undefined,
    n: N
  ): Maybe<T[N]> {
    return Maybe.of<T[N]>(someArray?.[n]);
  }

  map<R>(mapper: (value: NonNullable<T>) => R): Maybe<NonNullable<R>> {
    if (this.value != null) {
      return new Maybe<NonNullable<R>>(
        mapper(this.value as NonNullable<T>) as NonNullable<R>
      );
    }

    return new Maybe<NonNullable<R>>(null);
  }

  // NOTE: flatMap() "eats" the incomming maybe and will use the value of the current maybe as default
  // of the maybe returned by the Mapper()
  // you can safely use Maybies in the flatMap() function return value as if it was a direct value
  flatMap<U>(
    mapper: (value: NonNullable<T>) => U
  ): NonNullableMaybe<U extends Maybe<infer R> ? Maybe<R> : Maybe<U>> {
    type LocalReturn = NonNullableMaybe<
      U extends Maybe<infer R> ? Maybe<R> : Maybe<U>
    >;

    if (this.value != null) {
      const result = mapper(this.value as NonNullable<T>);

      if (result instanceof Maybe) {
        return new Maybe<U>(result.getValue(this.value)) as LocalReturn;
      }

      return new Maybe<U>(result) as LocalReturn;
    }

    return new Maybe<U>(null) as LocalReturn;
  }

  getValue(): T | null | undefined;
  getValue<D>(defaultValue: D): NonNullable<T> | D;
  getValue<D>(defaultValue?: D): T | D | null | undefined {
    if (this.value) {
      return this.value;
    }

    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    }

    return this.value;
  }
}
