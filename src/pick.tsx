import * as React from "react";
import { Columns, Styles, ToggleColumn } from ".";

interface IProps {
  columns: Columns;
  styles: Styles;
  toggle: ToggleColumn;
}

export const Pick: React.FunctionComponent<IProps> = props => {
  const { columns, toggle } = props;

  const columnComponents = columns.map(column => (
    <li key={column.id}>
      <input
        type="checkbox"
        checked={column.visible}
        onChange={_ => toggle(column)}
      />
      {column.text}
    </li>
  ));

  return <ol>{columnComponents}</ol>;
};
