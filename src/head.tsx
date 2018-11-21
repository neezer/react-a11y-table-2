import { Stream } from "@most/types";
import { css, cx } from "emotion";
import EventEmitter from "eventemitter3";
import * as React from "react";
import { Columns, IStickyConfig, ResizeColumns, Styles } from ".";
import { debug } from "./debug";
import { DragHandle } from "./dragHandle";
import { EndEvent } from "./endEvent";
import { DragRef } from "./types";
import { applyStyles, getStyleFrom, setupDragHandles } from "./utils";

export type Ref = HTMLTableSectionElement;

interface IProps {
  styles: Styles;
  sticky: IStickyConfig;
  columns: Columns;
  theadRef: React.RefObject<Ref>;
  resize: ResizeColumns;
}

const stickyStyle = css`
  position: sticky;
  top: 0;
`;

export class Head extends React.Component<IProps> {
  private dragRefs: Array<React.RefObject<DragRef>> = [];
  private endEmitter: EventEmitter = new EventEmitter();
  private endStream: Stream<true> = new EndEvent(this.endEmitter, "end");

  public componentDidMount() {
    debug("binding column drag handlers");

    const dragHandles = this.dragRefs.map(ref => ref.current);
    const end = () => this.endEmitter.emit("end");
    const endStream = this.endStream;
    const { resize } = this.props;

    const getDragHandlerProps = (props: IProps) => ({
      columns: props.columns,
      elements: dragHandles,
      end,
      endStream,
      resize
    });

    setupDragHandles(getDragHandlerProps(this.props));

    this.endEmitter.on("end", () => {
      debug("rebinding drag handlers with new props");
      setupDragHandles(getDragHandlerProps(this.props));
    });
  }

  public render() {
    const { columns, styles, sticky, theadRef } = this.props;
    const gridStyles = getStyleFrom(styles, "grid");
    const baseStyle = getStyleFrom(gridStyles, "headers");
    const hasStickyStyle = sticky.supported && sticky.enabled;
    const style = cx(applyStyles(baseStyle), { [stickyStyle]: hasStickyStyle });

    const columnLabels = columns.map(column => {
      const dragRef = React.createRef<DragRef>();

      this.dragRefs.push(dragRef);

      return (
        <th key={column.id} className={style} scope="col">
          {column.text}
          <DragHandle ref={dragRef} id={column.id} styles={styles} />
        </th>
      );
    });

    return (
      <thead ref={theadRef}>
        <tr>{columnLabels}</tr>
      </thead>
    );
  }
}
