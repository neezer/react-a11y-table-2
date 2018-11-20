import * as React from "react";
import * as T from ".";
import { Column } from "./column";
import { Pick } from "./pick";
import { Reorder } from "./reorder";
import { Resize } from "./resize";

interface IProps {
  columns: T.Columns;
  styles: T.Styles;
  reorder: T.ReorderColumns;
  resize: T.ResizeColumns;
  toggle: T.ToggleColumn;
}

export const Edit: React.FunctionComponent<IProps> = props => {
  const { styles, columns: allColumns, toggle, reorder, resize } = props;
  const visibleColumns = Column.getVisible(allColumns);

  return (
    <div>
      <Pick columns={allColumns} styles={styles} toggle={toggle} />
      <Reorder columns={visibleColumns} styles={styles} reorder={reorder} />
      <Resize columns={visibleColumns} styles={styles} resize={resize} />
    </div>
  );
};
