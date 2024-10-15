import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function run_test() {
    try {
      console.log(await invoke("plugin:polodb|list_databases"));
      console.log(
        await invoke("plugin:polodb|open_database", {
          key: "test",
          path: "./database_test_open",
        })
      );
      console.log(
        await invoke("plugin:polodb|insert", {
          database: "test",
          collection: "test",
          documents: [{ test: "beans" }],
        })
      );
      console.log(
        await invoke("plugin:polodb|find_all", {
          database: "test",
          collection: "test",
          sort: null,
        })
      );
      console.log(
        await invoke("plugin:polodb|update", {
          database: "test",
          collection: "test",
          query: { test: "beans" },
          update: { $set: { test: "sprouts" } },
          upsert: false,
        })
      );
      console.log(
        await invoke("plugin:polodb|find_all", {
          database: "test",
          collection: "test",
          sort: null,
        })
      );
      console.log(
        await invoke("plugin:polodb|delete_all", {
          database: "test",
          collection: "test",
        })
      );
      console.log(
        await invoke("plugin:polodb|find_all", {
          database: "test",
          collection: "test",
          sort: null,
        })
      );
      console.log(
        await invoke("plugin:polodb|close_database", {
          key: "test",
        })
      );
      console.log(await invoke("plugin:polodb|list_databases"));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>

      <button onClick={() => run_test()}>TEST</button>
    </div>
  );
}

export default App;
