import * as React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from "react-beautiful-dnd";
import { Columns, Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  columns: Columns;
  styles: Styles;
  saveNewOrder: (result: DropResult) => void;
}

export const ColumnReorder: React.FunctionComponent<IProps> = props => {
  const { columns, styles } = props;
  const reorderStyle = getStyleFrom(styles, "reorder");
  const containerStyle = getStyleFrom(reorderStyle, "container");
  const columnStyle = getStyleFrom(reorderStyle, "column");
  const textStyle = getStyleFrom(reorderStyle, "text");

  const columnComponents = columns.map((column, index) => (
    <Draggable key={column.id} draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={applyStyles(columnStyle)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <span className={applyStyles(textStyle)}>{column.text}</span>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext onDragEnd={props.saveNewOrder}>
      <div>
        <Droppable droppableId="columns" direction="horizontal">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={applyStyles(containerStyle)}
            >
              {columnComponents}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
