import { css } from "emotion";
import * as React from "react";
import { render } from "react-dom";
import { Table } from "../src";
import { config } from "./config";
import { data } from "./data";

const elem = document.getElementById("container");

const styles = {
  cell: css`
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
    padding: 5px 10px;
  `,
  headers: css`
    background-color: white;
    box-sizing: border-box;
    padding: 5px 10px;
    text-align: left;
    text-transform: uppercase;
  `,
  table: css`
    border-collapse: collapse;
    table-layout: fixed;
  `,
  wrapper: css`
    border: 1px solid #666;
    box-sizing: border-box;
    display: inline-block;
    width: 600px;
    height: 150px;
    overflow: scroll;
  `
};

render(<Table config={config} data={data} styles={styles} />, elem);
