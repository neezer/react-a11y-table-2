import * as React from "react";
import { Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  styles: Styles;
}

export const Actions: React.FunctionComponent<IProps> = props => {
  const actionsStyles = getStyleFrom(props.styles, "actions");
  const wrapperStyle = getStyleFrom(actionsStyles, "wrapper");

  return <div className={applyStyles(wrapperStyle)}>{props.children}</div>;
};
