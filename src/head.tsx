import { css, cx } from "emotion";
import * as React from "react";
import { Columns, IStickyConfig, Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

export type Ref = HTMLTableSectionElement;

interface IProps {
  styles: Styles;
  sticky: IStickyConfig;
  columns: Columns;
}

const stickyStyle = css`
  position: sticky;
  top: 0;
`;

export const Head = React.forwardRef<Ref, IProps>((props, ref) => {
  const { columns, styles, sticky } = props;
  const gridStyles = getStyleFrom(styles, "grid");
  const baseStyle = getStyleFrom(gridStyles, "headers");
  const hasStickyStyle = sticky.supported && sticky.enabled;
  const style = cx(applyStyles(baseStyle), { [stickyStyle]: hasStickyStyle });

  const columnLabels = columns.map(column => (
    <th key={column.id} className={style} scope="col">
      {column.text}
    </th>
  ));

  return (
    <thead ref={ref}>
      <tr>{columnLabels}</tr>
    </thead>
  );
});
