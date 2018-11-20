import * as most from "@most/core";
import { mousedown, mousemove, mouseup } from "@most/dom-event";
import { newDefaultScheduler } from "@most/scheduler";
import { allPass, gt, lensPath, lt, mergeDeepLeft, set } from "ramda";
import * as React from "react";
import { Columns, ResizeColumns, Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  columns: Columns;
  styles: Styles;
  resize: ResizeColumns;
}

interface IState {
  columnWidths: number[];
}

const THROTTLE_IN_MS = 10;
const MIN_WIDTH = 30;
const MAX_WIDTH = 1000;

export class Resize extends React.Component<IProps, IState> {
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
        this.props.resize(this.state.columnWidths);
      };

      const mousedowns = most.map(getX, mousedown(colElem));

      const mouseups = most.tap(
        mouseupEffects,
        most.map(getX, mouseup(window))
      );

      const mousemoves = most.skipRepeats(most.map(getX, mousemove(window)));

      const dragStream = most.chain((startX: number) => {
        const ΔxMoves = most.map(getΔX(startX), mousemoves);

        return most.until(mouseups, ΔxMoves);
      }, mousedowns);

      const effects = (Δx: number) => {
        this.updateColumnWidth(Δx, index);
      };

      const stream = most.tap(
        effects,
        most.throttle(THROTTLE_IN_MS, dragStream)
      );

      most.runEffects(stream, newDefaultScheduler());
    });
  }

  public render() {
    const { columns, styles } = this.props;
    const { columnWidths } = this.state;
    const editStyles = getStyleFrom(styles, "columnResize");
    const getEditStyle = getStyleFrom(editStyles);
    const textStyle = getEditStyle("text");
    const dragHandleStyle = getEditStyle("dragHandle");
    const containerStyle = getEditStyle("container");
    const controlContainerStyle = getEditStyle("controlContainer");

    const columnComponents = columns.map((column, index) => {
      const width = `${columnWidths[index] + 20}px !important`;
      const ref = React.createRef<HTMLButtonElement>();

      const columnStyle = mergeDeepLeft(
        { flexBasis: width },
        getEditStyle("column")
      );

      this.dragRefs.push(ref);

      return (
        <React.Fragment key={column.id}>
          <div className={applyStyles(columnStyle)}>
            <span className={applyStyles(textStyle)}>{column.text}</span>
          </div>
          <button ref={ref} className={applyStyles(dragHandleStyle)} />
        </React.Fragment>
      );
    });

    return (
      <div className={applyStyles(containerStyle)}>
        <div className={applyStyles(controlContainerStyle)}>
          {columnComponents}
        </div>
      </div>
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
