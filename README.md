# Another Maybe monad lib

![Main workflow](https://github.com/vojtatranta/actual-maybe/actions/workflows/main.yml/badge.svg)

This is another library that mimicks standard Maybe monad known from many functional languages.

It it supplied with standard API such as: `Maybe.of`, `Maybe#map`, `Maybe#flatMap`. For more info, [look at the tests](https://github.com/vojtatranta/actual-maybe/blob/master/src/Maybe.test.ts).

## Docs

For documentation, [look at the tests](https://github.com/vojtatranta/actual-maybe/blob/master/src/Maybe.test.ts). All the cases are tested there along with TS typings.

## API differences

There is just one interesting thing that might be more useful than other libraries out there. I wanted to be able to have this monad "as an input". This would be useful that I could write some safe transformation at one place:

```ts
function FilePickerComponent({
  doSomethingWithTheFile,
}: {
  doSomethingWithTheFile: (file: File) => void;
}) {
  return (
    <input
      type="file"
      onChange={Maybe.asInput((event: ChangeEvent<HTMLInputElement>) =>
        Maybe.of(event.target.files?.[0]).map(doSomethingWithTheFile)
      )}
    />
  );
}
```

This enables you to define the Maybe in a callback and you can even prepare this function before and memoize it.

## Installation

```
npm i --save actual-maybe

yarn add actual-maybe

pnpm i --save actual-maybe

bun i --save actual maybe
```

## Testing

Standard script:

```
npm run test --all

yarn test

bun run test
```

## Contributions

You are free to use this library propose any change in a pull request.

Cheers.
