import * as React from "react";
import { Columns, Datum, Styles } from ".";
import { getStyleFrom } from "./utils";

interface IProps {
  styles?: Styles;
  columns: Columns;
  data: Datum[];
}

export const Body: React.FunctionComponent<IProps> = props => {
  const { columns, data, styles } = props;
  const style = getStyleFrom(styles, "cell");

  const rows = data.map(datum => {
    const rowKey = datum.id;

    const cells = columns.map(column => {
      const value = datum[column.text];
      const cellKey = `${rowKey}--${column.id}`;
      const cellAttrs = { key: cellKey, className: style };

      return <td {...cellAttrs}>{value}</td>;
    });

    return <tr key={rowKey}>{cells}</tr>;
  });

  return <tbody>{rows}</tbody>;
};
