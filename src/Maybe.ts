type NonNullableMaybe<T, D = never> = T extends Maybe<infer U> ? U extends null ? D : Maybe<U> : D;
type NonNullablePart<T> = T extends null ? never : T

export class Maybe<T> {
  private value: T | null | undefined

  constructor(value: T | null | undefined) {
    this.value = value
  }

  static of<NV>(value: NV | null | undefined) {
    return new Maybe<NV>(value)
  }

  static asMaybeInput<NV, R>(callback: (input: Maybe<NV>) => R): (externalInput: NV) => R {
    return (externalInput: NV): R => callback(Maybe.of<NV>(externalInput))
  }

  static asInput<NV, R>(callback: (input: NonNullable<NV>) => R): (externalInput: NV) => Maybe<R> {
    return (externalInput: NV): Maybe<R> => Maybe.of<NV>(externalInput).map(callback)
  }

  map<R>(mapper: (value: NonNullable<T>) => R): Maybe<NonNullablePart<R>> {
    if (this.value != null) {
      return new Maybe<NonNullablePart<R>>(
        mapper(this.value) as NonNullablePart<R>
      )
    }

    return new Maybe<NonNullablePart<R>>(null)
  }

  // NOTE: flatMap() "eats" the incomming maybe and will use the value of the current maybe as default
  // of the maybe returned by the Mapper()
  // you can safely use Maybies in the flatMap() function return value as if it was a direct value
  flatMap<U>(
    mapper: (value: NonNullable<T>) => U
  ): NonNullableMaybe<U extends Maybe<infer R> ? Maybe<R> : Maybe<U>> {
    type LocalReturn = NonNullableMaybe<U extends Maybe<infer R> ? Maybe<R> : Maybe<U>>

    if (this.value != null) {
      const result = mapper(this.value)

      if (result instanceof Maybe) {
        return new Maybe<U>(result.getValue(this.value)) as LocalReturn
      }

      return new Maybe<U>(result) as LocalReturn
    }

    return new Maybe<U>(null) as LocalReturn
  }

  getValue(): T | undefined
  getValue<D>(defaultValue: D): NonNullable<T> | D
  getValue<D>(defaultValue?: D): NonNullable<T> | D | undefined {
    return this.value || defaultValue
  }
}

