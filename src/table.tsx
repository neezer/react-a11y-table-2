import { css, cx } from "emotion";
import { map, sum } from "ramda";
import * as React from "react";
import { Columns, Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  styles: Styles;
  columns: Columns;
}

export const Table: React.FunctionComponent<IProps> = props => {
  const { children, columns, styles } = props;
  const tableWidth = sum(map(({ config }) => config.width, columns));
  const gridStyles = getStyleFrom(styles, "grid");
  const tableStyles = getStyleFrom(gridStyles, "table");

  const style = cx(
    applyStyles(tableStyles),
    css`
      width: ${tableWidth}px;
    `
  );

  return <table className={style}>{children}</table>;
};
