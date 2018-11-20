import * as React from "react";
import { Columns, Styles } from ".";
import { Column } from "./column";

interface IProps {
  columns: Columns;
  styles: Styles;
  toggle: (
    column: Column
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColumnPicker: React.FunctionComponent<IProps> = props => {
  const { columns, toggle } = props;

  const columnComponents = columns.map(column => (
    <li key={column.id}>
      <input
        type="checkbox"
        checked={column.visible}
        onChange={toggle(column)}
      />
      {column.text}
    </li>
  ));

  return <ol>{columnComponents}</ol>;
};
