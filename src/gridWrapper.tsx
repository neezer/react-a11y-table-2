import { not } from "ramda";
import * as React from "react";
import { IStickyConfig, Styles } from ".";
import { debug } from "./debug";
import { applyStyles, getStyleFrom } from "./utils";

type THeadRef = React.RefObject<HTMLTableSectionElement>;

interface IProps {
  styles: Styles;
  sticky: IStickyConfig;
  theadRef: THeadRef;
}

export const GridWrapper: React.FunctionComponent<IProps> = props => {
  const { children, styles, sticky, theadRef } = props;
  const gridStyles = getStyleFrom(styles, "grid");
  const style = getStyleFrom(gridStyles, "wrapper");
  const wrapperProps: React.HTMLAttributes<HTMLDivElement> = {};

  if (sticky.enabled && not(sticky.supported)) {
    debug("sticky headers not supported; falling back on scroll handler");

    wrapperProps.onScroll = followHeaders(theadRef);
  }

  return (
    <div className={applyStyles(style)} {...wrapperProps}>
      {children}
    </div>
  );
};

function followHeaders(theadRef: THeadRef) {
  return (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop: top } = event.currentTarget;
    const translate = `translate(0,${top}px)`;
    const thead = theadRef.current;

    if (thead !== null) {
      thead.style.transform = translate;
    } else {
      debug("no thead ref found; aborting sticky header move");
    }
  };
}
