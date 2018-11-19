import { injectGlobal } from "emotion";
import * as React from "react";
import { render } from "react-dom";
import { Table } from "../src";
import { config } from "./config";
import { data } from "./data";

const elem = document.getElementById("container");

const _ = injectGlobal`
  body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  #container {
    flex: 0 0 960px;
    height: 400px;
  }
`;

const styles = {
  wrapper: {}
};

render(<Table config={config} data={data} styles={styles} />, elem);
