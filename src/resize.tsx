import * as most from "@most/core";
import { mousedown, mousemove, mouseup } from "@most/dom-event";
import { newDefaultScheduler } from "@most/scheduler";
import * as R from "ramda";
import * as React from "react";
import { Columns, ResizeColumns, Styles } from ".";
import * as utils from "./utils";

interface IProps {
  columns: Columns;
  styles: Styles;
  resize: ResizeColumns;
}

interface IXPos {
  x: number;
}

interface IXColId {
  columnId: string;
}

type IXMove = IXPos & IXColId;

type IΔXChange = IXColId & {
  Δx: number;
};

const THROTTLE_IN_MS = 10;

export class Resize extends React.Component<IProps> {
  private dragRefs: Array<React.RefObject<HTMLButtonElement>> = [];

  public componentDidMount() {
    let { columns: visibleColumns } = this.props;

    this.dragRefs.forEach(ref => {
      if (ref.current === null) {
        return;
      }

      const { current: colElem } = ref;
      const mousedowns = most.map(getColIdAndX, mousedown(colElem));

      const mouseups = most.tap((_: MouseEvent) => {
        visibleColumns = this.props.columns;
      }, mouseup(window));

      const mousemoves = most.skipRepeats(most.map(getX, mousemove(window)));

      const dragStream = most.chain((props: IXMove) => {
        const ΔxMoves = most.map(getΔX(props), mousemoves);

        return most.until(mouseups, ΔxMoves);
      }, mousedowns);

      const effects = (props: IΔXChange) => {
        const updateVisible = utils.updateColumnWidth({ visibleColumns });
        const newVisibleColumns = updateVisible(props);

        this.props.resize(newVisibleColumns);
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
    const editStyles = utils.getStyleFrom(styles, "columnResize");
    const getEditStyle = utils.getStyleFrom(editStyles);
    const textStyle = getEditStyle("text");
    const dragHandleStyle = getEditStyle("dragHandle");
    const controlContainerStyle = getEditStyle("controlContainer");

    const columnComponents = columns.map(column => {
      const width = `${column.width + 20}px !important`;
      const ref = React.createRef<HTMLButtonElement>();

      const columnStyle = R.mergeDeepLeft(
        { flexBasis: width },
        getEditStyle("column")
      );

      this.dragRefs.push(ref);

      return (
        <React.Fragment key={column.id}>
          <div className={utils.applyStyles(columnStyle)}>
            <span className={utils.applyStyles(textStyle)}>{column.text}</span>
          </div>
          <button
            ref={ref}
            className={utils.applyStyles(dragHandleStyle)}
            data-id={column.id}
          />
        </React.Fragment>
      );
    });

    return (
      <section>
        <div className={utils.applyStyles(controlContainerStyle)}>
          {columnComponents}
        </div>
      </section>
    );
  }
}

function getX(event: MouseEvent) {
  return { x: event.x };
}

function getΔX({ x: startX, columnId }: IXMove) {
  return ({ x }: IXPos) => ({
    columnId,
    Δx: x - startX
  });
}

function getColIdAndX(event: MouseEvent) {
  const elem = event.currentTarget as HTMLButtonElement;
  const columnId = elem.dataset.id;

  return { ...getX(event), columnId: columnId || "" };
}
