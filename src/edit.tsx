import * as React from "react";
import {
  ChangeMode,
  Columns,
  ReorderColumns,
  ResizeColumns,
  Styles,
  ToggleColumn
} from ".";
import { Column } from "./column";
import { Pick } from "./pick";
import { Reorder } from "./reorder";
import { Resize } from "./resize";
import { Modes } from "./types";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  columns: Columns;
  styles: Styles;
  reorder: ReorderColumns;
  resize: ResizeColumns;
  toggle: ToggleColumn;
  changeMode: ChangeMode;
}

export const Edit: React.FunctionComponent<IProps> = props => {
  const { styles, columns, toggle, reorder, resize, changeMode } = props;
  const visibleColumns = Column.getVisible(columns);
  const editStyles = getStyleFrom(styles, "edit");
  const getEditStyle = getStyleFrom(editStyles);
  const containerStyle = getEditStyle("container");

  return (
    <div className={applyStyles(containerStyle)}>
      <Pick columns={columns} styles={styles} toggle={toggle} />
      <Reorder columns={visibleColumns} styles={styles} reorder={reorder} />
      <Resize columns={visibleColumns} styles={styles} resize={resize} />

      <button onClick={_ => changeMode(Modes.View)}>Save Changes</button>
    </div>
  );
};
