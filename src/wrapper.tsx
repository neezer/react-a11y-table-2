import * as React from "react";
import { Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  styles: Styles;
}

export const Wrapper: React.FunctionComponent<IProps> = props => {
  const style = getStyleFrom(props.styles, "wrapper");

  return <div className={applyStyles(style)}>{props.children}</div>;
};
