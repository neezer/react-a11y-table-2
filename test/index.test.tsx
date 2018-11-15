import { JSDOM } from "jsdom";
import { anyPass, complement, isEmpty, isNil } from "ramda";
import * as React from "react";
import { cleanup, render } from "react-testing-library";
import test, { Test } from "tape";
import { Table } from "../src";
import { config } from "./fixtures/config-1";
import { data } from "./fixtures/data-1";

const isAbsent = anyPass([isEmpty, isNil]);
const isPresent = complement(isAbsent);

type Global = NodeJS.Global & { document: Document; window: Window };

test("setup", (t: Test) => {
  const { window } = new JSDOM(`<!DOCTYPE html>`);
  const { document } = window;

  (global as Global).window = window;
  (global as Global).document = document;

  t.end();
});

test("renders an empty state", (t: Test) => {
  try {
    let { getByText } = render(<Table config={config} data={[]} />);

    getByText("No records matched your search");

    t.pass("empty message exists");

    const newConfig = { ...config, emptyMessage: "bananas" };

    getByText = render(<Table config={newConfig} data={[]} />).getByText;

    getByText("bananas");

    t.pass("custom empty message exists");
  } catch (error) {
    t.fail(error);
  } finally {
    cleanup();

    t.end();
  }
});

test("renders data", (t: Test) => {
  const { getByText } = render(<Table config={config} data={data} />);

  try {
    const cell = getByText("Hermione Granger");

    t.ok(isPresent(cell), "table cell exists");
    t.strictEqual(cell.tagName, "TD", "is a table cell");
  } catch (error) {
    t.fail(error);
  } finally {
    cleanup();

    t.end();
  }
});
