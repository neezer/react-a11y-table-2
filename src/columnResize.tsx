import {
  chain,
  map,
  runEffects,
  skipRepeats,
  tap,
  throttle,
  until
} from "@most/core";
import { mousedown, mousemove, mouseup } from "@most/dom-event";
import { newDefaultScheduler } from "@most/scheduler";
import { css } from "emotion";
import { allPass, gt, lensPath, lt, mergeDeepLeft, set } from "ramda";
import * as React from "react";
import { Columns, Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  columns: Columns;
  styles: Styles;
  resize: (widths: number[]) => void;
}

interface IState {
  columnWidths: number[];
}

const draggingStyle = css`
  cursor: grabbing !important;
`;

const dragHandleStyle = css`
  cursor: grab;
`;

const THROTTLE = 10; // milliseconds
const MIN_WIDTH = 30;
const MAX_WIDTH = 1000;

export class ColumnResize extends React.Component<IProps, IState> {
  public state = {
    columnWidths: this.props.columns.map(column => column.config.width)
  };

  private dragRefs: Array<React.RefObject<HTMLButtonElement>> = [];

  public componentDidMount() {
    this.dragRefs.forEach((ref, index) => {
      if (ref.current === null) {
        return;
      }

      const { current: colElem } = ref;

      const mouseupEffects = (_: number) => {
        dragStyle.remove();
        this.props.resize(this.state.columnWidths);
      };

      const dragStyle = toggleStyle(draggingStyle, colElem);
      const mousedowns = tap(dragStyle.add, map(getX, mousedown(colElem)));
      const mouseups = tap(mouseupEffects, map(getX, mouseup(window)));
      const mousemoves = skipRepeats(map(getX, mousemove(window)));

      const dragStream = chain((startX: number) => {
        const ΔxMoves = map(getΔX(startX), mousemoves);

        return until(mouseups, ΔxMoves);
      }, mousedowns);

      const effects = (Δx: number) => {
        this.updateColumnWidth(Δx, index);
      };

      const stream = tap(effects, throttle(THROTTLE, dragStream));

      runEffects(stream, newDefaultScheduler());
    });
  }

  public render() {
    const { columns, styles } = this.props;
    const { columnWidths } = this.state;
    const editStyle = getStyleFrom(styles, "columnEdit");
    const containerStyle = getStyleFrom(editStyle, "container");
    const textStyle = getStyleFrom(editStyle, "text");

    const columnComponents = columns.map((column, index) => {
      const width = `${columnWidths[index]}px !important`;
      const ref = React.createRef<HTMLButtonElement>();

      this.dragRefs.push(ref);

      const columnStyle = mergeDeepLeft(
        { flexBasis: width },
        getStyleFrom(editStyle, "column")
      );

      return (
        <React.Fragment key={column.id}>
          <div className={applyStyles(columnStyle)}>
            <span className={applyStyles(textStyle)}>{column.text}</span>
          </div>
          <button ref={ref} className={dragHandleStyle}>
            Drag handle
          </button>
        </React.Fragment>
      );
    });

    return (
      <div className={applyStyles(containerStyle)}>{columnComponents}</div>
    );
  }

  private updateColumnWidth = (Δx: number, index: number) => {
    const column = this.props.columns[index];
    const lens = lensPath(["columnWidths", index]);
    const newWidth = column.config.width + Δx;
    const inBounds = allPass([gt(MAX_WIDTH), lt(MIN_WIDTH)]);

    if (inBounds(newWidth)) {
      const update = set(lens, newWidth);

      this.setState(update);
    }
  };
}

function getX(event: MouseEvent) {
  return event.x;
}

function getΔX(startX: number) {
  return (x: number) => x - startX;
}

function toggleStyle(style: string, elem: HTMLButtonElement) {
  return {
    add: () => {
      elem.classList.add(style);
    },
    remove: () => {
      elem.classList.remove(style);
    }
  };
}
