import * as React from "react";
import { Styles } from ".";
import { DragRef } from "./types";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  id: string;
  styles: Styles;
}

export const DragHandle = React.forwardRef<DragRef, IProps>((props, ref) => {
  const style = getStyleFrom(props.styles, "dragHandle");

  return (
    <button ref={ref} data-id={props.id} className={applyStyles(style)}>
      drag
    </button>
  );
});
