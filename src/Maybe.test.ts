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

describe("Maybe", () => {

    describe("getting original or default value", () => {
        it("should return null when Maybe is A | null | undefined", () => {
            const a = getNullableA()

            const result: A | null | undefined = Maybe.of(a).getValue()
            expect(result).toEqual(null)
        })
        
        it("should return undefined when default null parameter is passed to getValue()", () => {
            const a = getNullableA()

            const result: A | null = Maybe.of(a).getValue(null)
            expect(result).toEqual(null)
        })

        it("should return default when default parameter is passed to getValue()", () => {
            const a = getNullableA()
            const b = "b" as const

            const result: A | "b" = Maybe.of(a).getValue(b)
            expect(result).toEqual("b")
        })

        it("should return original when default parameter is passed to getValue()", () => {
            const a = "a" as const
            const b = "b" as const

            const result: "a" | "b" = Maybe.of(a).getValue(b)
            expect(result).toEqual("a")
        })

        it("should return original when default parameter is NOT passed to getValue()", () => {
            const a = "a" as const

            const result: "a" | undefined | null = Maybe.of(a).getValue()
            expect(result).toEqual("a")
        })

        it("should return original when default parameter is passed to getValue() with null", () => {
            const a = "a" as const

            const result: "a" | null = Maybe.of(a).getValue(null)
            expect(result).toEqual("a")
        })

        describe("Maybe#all()", () => {
            it("should resolve all() values as results", (callback) => {
                Maybe.all(["a" as const, "b" as const]).map(([a, b]: ["a", "b"]) => {
                    expect(a).toEqual("a")
                    expect(b).toEqual("b")
                    callback()
                })
            })

            it("should resolve all() maybies as results", (callback) => {
                Maybe.all([Maybe.of("a" as const), Maybe.of("b" as const)]).map(([a, b]: ["a", "b"]) => {
                    expect(a).toEqual("a")
                    expect(b).toEqual("b")
                    callback()
                })
            })

            it("should resolve all() some values and some mabies and upack them as results", (callback) => {
                Maybe.all(["a" as const, Maybe.of("b" as const)]).map(([a, b]: ["a", "b"]) => {
                    expect(a).toEqual("a")
                    expect(b).toEqual("b")
                    callback()
                })
            })

            it("should NOT resolve all() because some value is nullable", (callback) => {
                const value = Maybe.all(["a" as const, Maybe.of("b" as const), null]).map(() => {
                    callback.fail()
                }).getValue("c" as const)

                expect(value).toEqual("c")
                callback()
            })
        })
    })

    describe("type tests", () => {
        
    it("basic Maybe of A", () => {
        const result: Maybe<A>  = Maybe.of(getNullableA())
    })

    it("string or null", () => {
        const result: null | string  = Maybe.of("ahoj").getValue(null)
    })

    it("string or undefined", () => {
        const result: undefined | string | null  = Maybe.of("ahoj").getValue()
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
})