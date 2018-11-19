import * as React from "react";
import { Columns, Datum, Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  styles: Styles;
  columns: Columns;
  data: Datum[];
}

export const Body: React.FunctionComponent<IProps> = props => {
  const { columns, data, styles } = props;
  const gridStyles = getStyleFrom(styles, "grid");
  const cellStyles = getStyleFrom(gridStyles, "cell");
  const rowStyles = getStyleFrom(gridStyles, "row");

  const rows = data.map(datum => {
    const rowKey = datum.id;

    const cells = columns.map(column => {
      const value = datum[column.text];
      const cellKey = `${rowKey}--${column.id}`;
      const cellAttrs = { key: cellKey, className: applyStyles(cellStyles) };

      return <td {...cellAttrs}>{value}</td>;
    });

    return (
      <tr key={rowKey} className={applyStyles(rowStyles)}>
        {cells}
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
};
