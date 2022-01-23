import * as React from "react";
import { render } from "react-dom";

import "./index.css";
import { App } from "./app";

function Root() {
  return <App />;
}

render(
  <Root />,
  document.getElementById("root")!,
);
