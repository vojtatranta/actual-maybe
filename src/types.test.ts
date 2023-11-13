import { Maybe } from './Maybe'


class A {}

class B {}

const getNullableA = (): A | null => {
  return null
}

const getNullableB = (): B | null => {
  return null

}

const bToNullable = (b: B): B | null => {
  return null
}

describe("Types test of Maybe", () => {
    it("basic Maybe of A", () => {
        const result: Maybe<A>  = Maybe.of(getNullableA())
    })

    it("string or null", () => {
        const result: null | string  = Maybe.of("ahoj").getValue(null)
    })

    it("string or undefined", () => {
        const result: undefined | string  = Maybe.of("ahoj").getValue()
    })

    it("nullable or B", () => {
        const result: B | "ahoj" = Maybe.of(getNullableB()).map(b => bToNullable(b)).getValue("ahoj" as const)
    })

    describe("map", () => {
        it("B to A through map()", () => {
            const result: Maybe<A> = Maybe.of(getNullableB()).map(() => getNullableA())
        })
    })

    describe("flatMap", () => {
        it("B to A through flatMap() through 'eating Maybe<A>'", () => {
            const result: Maybe<A> = Maybe.of(getNullableB()).flatMap(() => Maybe.of(getNullableA()))
        })

        it("B to A through flatMap()", () => {
            const result: Maybe<A> = Maybe.of(getNullableB()).flatMap(() => getNullableA())
        })
    })



    describe("as input function", () => {
        it("string to Maybe<number> through asInput()", () => {
            const inputMaybeFunc =  Maybe.asInput((input: string) => input.length)
            const result: Maybe<number> = inputMaybeFunc("test")
        })

        it("string to Maybe<number> through asMaybeInput()", () => {
            const inputAsMaybeFunc =  Maybe.asMaybeInput((maybeInput: Maybe<string>) => maybeInput.map((str) => str.length))
            const result: Maybe<number> = inputAsMaybeFunc("test")
        })
    })
})