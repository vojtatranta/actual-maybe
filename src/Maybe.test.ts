/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Maybe } from "./Maybe";

class A {}

class B {}

const getNullableA = (): A | null => {
  return null;
};

const getNullableB = (): B | null => {
  return null;
};

const bToNullable = (b: B): B | null => {
  return null;
};

describe("Maybe", () => {
  describe("getting original or default value", () => {
    it("should return null when Maybe is A | null | undefined", () => {
      const a = getNullableA();

      const result: A | null | undefined = Maybe.of(a).getValue();
      expect(result).toEqual(null);
    });

    it("should return undefined when default null parameter is passed to getValue()", () => {
      const a = getNullableA();

      const result: A | null = Maybe.of(a).getValue(null);
      expect(result).toEqual(null);
    });

    it("should return default when default parameter is passed to getValue()", () => {
      const a = getNullableA();
      const b = "b" as const;

      const result: A | "b" = Maybe.of(a).getValue(b);
      expect(result).toEqual("b");
    });

    it("should narrow a chained value properly", () => {
      const objectWithFalsy: {
        falsyValue: string | null | undefined;
      }[] = [
        {
          falsyValue: "string",
        },
      ];

      const result = Maybe.of(objectWithFalsy[0])
        .map(({ falsyValue }) => falsyValue)
        .map((value: string) => value)
        .getValue("not-string");

      expect(result).toEqual("string");
    });

    it("should return original when default parameter is passed to getValue()", () => {
      const a = "a" as const;
      const b = "b" as const;

      const result: "a" | "b" = Maybe.of(a).getValue(b);
      expect(result).toEqual("a");
    });

    it("should return the default value type when the mapping returns falsy", () => {
      const result: "b" = Maybe.of("a" as const)
        .map(() => null)
        .getValue("b");
      expect(result).toEqual("b");
    });

    it("should return the default value type when the value is null", () => {
      const result: "b" = Maybe.of(null).getValue("b");
      expect(result).toEqual("b");
    });

    it("should return original when default parameter is NOT passed to getValue()", () => {
      const a = "a" as const;

      const result: "a" | undefined | null = Maybe.of(a).getValue();
      expect(result).toEqual("a");
    });
    it("should narrow undefined value to the truthy value in map()", () => {
      const a = "a" as const;

      const result: "a" | undefined | null = Maybe.of(a)
        .map((a: "a") => {
          return a;
        })
        .getValue();
      expect(result).toEqual("a");
    });

    it("should return original when default parameter is passed to getValue() with null", () => {
      const a = "a" as const;

      const result: "a" | null = Maybe.of(a).getValue(null);
      expect(result).toEqual("a");
    });

    describe("Maybe#all()", () => {
      it("should resolve all() values as results", (callback) => {
        Maybe.all(["a" as const, "b" as const]).map(([a, b]: ["a", "b"]) => {
          expect(a).toEqual("a");
          expect(b).toEqual("b");
          callback();
        });
      });

      it("should resolve all() maybies as results", (callback) => {
        Maybe.all([Maybe.of("a" as const), Maybe.of("b" as const)]).map(
          ([a, b]: ["a", "b"]) => {
            expect(a).toEqual("a");
            expect(b).toEqual("b");
            callback();
          }
        );
      });

      it("should resolve all() some values and some mabies and upack them as results", (callback) => {
        Maybe.all(["a" as const, Maybe.of("b" as const)]).map(
          ([a, b]: ["a", "b"]) => {
            expect(a).toEqual("a");
            expect(b).toEqual("b");
            callback();
          }
        );
      });

      it("should NOT resolve all() because some value is nullable", (callback) => {
        const value = Maybe.all(["a" as const, Maybe.of("b" as const), null])
          .map(() => {
            callback.fail();
          })
          .getValue("c" as const);

        expect(value).toEqual("c");
        callback();
      });

      it("should narrow nullable value in to non nullable", (callback) => {
        const nullableA: string | null | undefined = "a";
        const value = Maybe.all([nullableA])
          .map(([truthyA]: [string]) => truthyA)
          .getValue();

        expect(value).toEqual("a");
        callback();
      });

      it("should narrow multiple nullable values in to non nullable", (callback) => {
        const nullableA: string | null = "a";
        const nullableB: string | null = "b";
        const value = Maybe.all([nullableA, nullableB])
          .map(([truthyA, truthyB]: [string, string]) => {
            return "a";
          })
          .getValue("a");

        expect(value).toEqual("a");
        callback();
      });
    });
  });

  describe("type tests", () => {
    it("basic Maybe of A", () => {
      const result: Maybe<A> = Maybe.of(getNullableA());
    });

    it("string or null", () => {
      const result: null | string = Maybe.of("ahoj").getValue(null);
    });

    it("string or undefined", () => {
      const result: undefined | string | null = Maybe.of("ahoj").getValue();
    });

    it("nullable or B", () => {
      const result: B | "ahoj" = Maybe.of(getNullableB())
        .map((b) => bToNullable(b))
        .getValue("ahoj" as const);
    });

    describe("map", () => {
      it("B to A through map()", () => {
        const result: Maybe<A> = Maybe.of(getNullableB()).map(() =>
          getNullableA()
        );
      });
    });

    describe("flatMap", () => {
      it("B to A through flatMap() through 'eating Maybe<A>'", () => {
        const result: Maybe<A> = Maybe.of(getNullableB()).flatMap(() =>
          Maybe.of(getNullableA())
        );
      });

      it("B to A through flatMap()", () => {
        const result: Maybe<A> = Maybe.of(getNullableB()).flatMap(() =>
          getNullableA()
        );
      });
    });

    describe("as input function", () => {
      it("string to Maybe<number> through asInput()", () => {
        const inputMaybeFunc = Maybe.asInput((input: string) => input.length);
        const result: Maybe<number> = inputMaybeFunc("test");
      });

      it("should keep the reference to the originally defined as input function", () => {
        class ANumber {
          constructor(public value: number) {
            this.value = value;
          }
        }
        const inputMaybeFunc = Maybe.asInput(
          (input: string) => new ANumber(input.length)
        );
        const result1: Maybe<ANumber> = inputMaybeFunc("test");
        const result2: Maybe<ANumber> = inputMaybeFunc("test");
        expect(inputMaybeFunc).toBe(inputMaybeFunc);
        expect(result1).not.toBe(result2);
      });

      it("string to Maybe<number> through asMaybeInput()", () => {
        const inputAsMaybeFunc = Maybe.asMaybeInput(
          (maybeInput: Maybe<string>) => maybeInput.map((str) => str.length)
        );
        const result: Maybe<number> = inputAsMaybeFunc("test");
      });
    });

    describe("extraction of array elements", () => {
      describe("fromFirst()", () => {
        it("fromFirst()", () => {
          const result: Maybe<string> = Maybe.fromFirst(["a", "b", "c"]);

          expect(result.getValue()).toEqual("a");
        });

        it("should narrow a chained value properly", () => {
          const objectWithFalsy: {
            falsyValue: string | null | undefined;
          }[] = [
            {
              falsyValue: "string",
            },
          ];

          const result = Maybe.fromFirst(objectWithFalsy)
            .map(({ falsyValue }) => falsyValue)
            .map((value: string) => value)
            .getValue("not-string");

          expect(result).toEqual("string");
        });

        it("should mantain the constant type of the first element", () => {
          const result = Maybe.fromFirst([
            "a" as const,
            "b" as const,
            "c" as const,
          ] as const);

          result.map((value: "a") => {
            expect(value).toEqual("a");
          });
        });

        it("should mantain the type of the first element", (callback) => {
          const result = Maybe.fromFirst(["a", "b", "c"]);

          result.map((value: string) => {
            expect(value).toEqual("a");
            callback();
          });
        });

        it("should apply the default value when the first element is null", () => {
          const result = Maybe.fromFirst([null, "b", "c"]);

          const dConst: string = result.getValue("d");

          expect(dConst).toEqual("d");
        });
      });

      describe("fromLast()", () => {
        it("should get the last element", () => {
          const result: Maybe<string> = Maybe.fromLast(["a", "b", "c"]);

          expect(result.getValue()).toEqual("c");
        });

        it("should map the last element", (callback) => {
          const result = Maybe.fromLast([
            "a" as const,
            "b" as const,
            "c" as const,
          ]);

          result.map((value: "c") => {
            expect(value).toEqual("c");
            callback();
          });
        });

        it("should apply the default value when the last element is null", () => {
          const result = Maybe.fromLast(["a", "b", null]);

          expect(result.getValue("d")).toEqual("d");
        });

        it("should apply the default value when the last element is undefined", () => {
          const result = Maybe.fromLast(["b", "c", undefined]);

          expect(result.getValue("X")).toEqual("X");
        });

        it("should mantain the constant type of the last element", (callback) => {
          const result = Maybe.fromLast([
            "a" as const,
            "b" as const,
            "c" as const,
          ] as const);

          result.map((value: "c") => {
            expect(value).toEqual("c");
            callback();
          });
        });
      });

      describe("fromNth()", () => {
        it("should get the nth element", () => {
          const result: Maybe<string> = Maybe.fromNth(["a", "b", "c"], 1);

          expect(result.getValue()).toEqual("b");
        });

        it("should map the nth element", (callback) => {
          const result = Maybe.fromNth(
            ["a" as const, "b" as const, "c" as const],
            1
          );

          result.map((value: string) => {
            expect(value).toEqual("b");
            callback();
          });
        });

        it("should apply the default value when the nth element is null", () => {
          const result = Maybe.fromNth(["a", "b", null], 2);

          expect(result.getValue("X")).toEqual("X");
        });

        it("should mantain the type of the nth element in a mixed array", (callback) => {
          const result = Maybe.fromNth(["a", "b", 123, null], 2);

          result.map((value: string | number) => {
            expect(value).toEqual(123);
            callback();
          });
        });
      });
    });
  });

  describe("orNull", () => {
    it("should return the value when it exists", () => {
      const value = "test" as const;
      const result = Maybe.of(value).orNull();
      expect(result).toEqual("test");
    });

    it("should return null when value is undefined", () => {
      const result = Maybe.of(undefined).orNull();
      expect(result).toEqual(null);
    });

    it("should return null when value is null", () => {
      const result = Maybe.of(null).orNull();
      expect(result).toEqual(null);
    });
  });

  describe("andThen", () => {
    it("should transform value like map() when value exists", () => {
      const value = "test" as const;
      const result = Maybe.of(value)
        .andThen((str) => str.length)
        .getValue();
      expect(result).toEqual(4);
    });

    it("should return Maybe with null when value is null", () => {
      const a: string | null = null;
      const result = Maybe.of(a)
        .andThen((str: never) => {
          return str;
        })
        .getValue();
      expect(result).toEqual(null);
    });

    it("should chain multiple transformations", () => {
      const value = "test" as const;
      const result = Maybe.of(value)
        .andThen((str) => str.length)
        .andThen((len) => len * 2)
        .getValue();
      expect(result).toEqual(8);
    });
  });
});
