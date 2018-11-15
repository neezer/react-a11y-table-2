import { css, cx } from "emotion";
import * as React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Columns, IStickyConfig, Styles } from ".";
import { getStyleFrom } from "./utils";

export type Ref = HTMLTableSectionElement;

interface IProps {
  styles?: Styles;
  sticky: IStickyConfig;
  columns: Columns;
  onReorder: (result: any) => void;
}

const stickyStyle = css`
  position: sticky;
  top: 0;
`;

export const Head = React.forwardRef<Ref, IProps>((props, ref) => {
  const { columns, styles, sticky, onReorder } = props;
  const baseStyle = getStyleFrom(styles, "headers");
  const hasStickyStyle = sticky.supported && sticky.enabled;
  const style = hasStickyStyle ? cx(baseStyle, stickyStyle) : baseStyle;

  const columnLabels = columns.map((column, index) => (
    <Draggable key={column.id} draggableId={column.id} index={index}>
      {provided => (
        <th
          className={style}
          scope="col"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {column.text}
        </th>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext onDragEnd={onReorder}>
      <thead ref={ref}>
        <Droppable droppableId="column-headers" direction="horizontal">
          {provided => (
            <tr {...provided.droppableProps} ref={provided.innerRef}>
              {columnLabels}
              {provided.placeholder}
            </tr>
          )}
        </Droppable>
      </thead>
    </DragDropContext>
  );
});
