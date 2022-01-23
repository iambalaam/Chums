import * as React from "react";
import { Nav } from "./components/nav";
import { Loading } from "./components/loading";

// App must be rendered inside providers.
export function App() {
  return (
    <div id="app">
      <Nav />
      <div className="container">
        <Loading />
      </div>
    </div>
  );
}
