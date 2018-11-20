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
  changeMode: T.ChangeMode;
}

export const Edit: React.FunctionComponent<IProps> = props => {
  const { styles, columns, toggle, reorder, resize, changeMode } = props;
  const visibleColumns = Column.getVisible(columns);

  return (
    <div>
      <Pick columns={columns} styles={styles} toggle={toggle} />
      <Reorder columns={visibleColumns} styles={styles} reorder={reorder} />
      <Resize columns={visibleColumns} styles={styles} resize={resize} />

      <button onClick={_ => changeMode(T.Modes.View)}>Save Changes</button>
    </div>
  );
};
