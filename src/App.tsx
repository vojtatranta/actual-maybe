import React, { ChangeEvent } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Maybe } from "./Maybe";

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
          <FilePickerComponent doSomethingWithTheFile={console.log} />
        </form>
      </header>
    </div>
  );
}

export default App;
