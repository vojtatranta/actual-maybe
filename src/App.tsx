import React, { ChangeEvent } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Maybe } from "./Maybe";

function FileComponent(props: {
  doSomethingWithTheFile: (file: File) => void;
}) {
  return (
    <input
      type="file"
      onChange={Maybe.asInput((event: ChangeEvent<HTMLInputElement>) =>
        Maybe.of(event.target.files?.[0]).map((truthyFile) =>
          props.doSomethingWithTheFile(truthyFile)
        )
      )}
    />
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <form>
          <FileComponent doSomethingWithTheFile={console.log} />
        </form>
      </header>
    </div>
  );
}

export default App;
