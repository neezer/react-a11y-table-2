import * as React from "react";
import { ChangeMode, Columns, ReorderColumns, Styles } from ".";
import { Reorder } from "./reorder";
import { Modes } from "./types";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  columns: Columns;
  styles: Styles;
  reorder: ReorderColumns;
  changeMode: ChangeMode;
}

export const Edit: React.FunctionComponent<IProps> = props => {
  const { styles, columns, reorder, changeMode } = props;
  const editStyles = getStyleFrom(styles, "edit");
  const getEditStyle = getStyleFrom(editStyles);
  const containerStyle = getEditStyle("container");

  return (
    <div className={applyStyles(containerStyle)}>
      <Reorder columns={columns} styles={styles} reorder={reorder} />

      <button onClick={_ => changeMode(Modes.View)}>Save Changes</button>
    </div>
  );
};
