import * as React from "react";
import * as DnD from "react-beautiful-dnd";
import { Columns, ReorderColumns, Styles } from ".";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  columns: Columns;
  styles: Styles;
  reorder: ReorderColumns;
}

export const Reorder: React.FunctionComponent<IProps> = props => {
  const { columns, styles } = props;
  const editStyle = getStyleFrom(styles, "columnReorder");
  const containerStyle = getStyleFrom(editStyle, "container");
  const columnStyle = getStyleFrom(editStyle, "column");
  const controlContainerStyle = getStyleFrom(editStyle, "controlContainer");
  const textStyle = getStyleFrom(editStyle, "text");

  const columnComponents = columns.map((column, index) => (
    <DnD.Draggable key={column.id} draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={applyStyles(columnStyle)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getDraggingStyle(
            provided.draggableProps.style,
            snapshot.isDragging
          )}
          ref={provided.innerRef}
        >
          <span className={applyStyles(textStyle)}>{column.text}</span>
        </div>
      )}
    </DnD.Draggable>
  ));

  return (
    <div className={applyStyles(containerStyle)}>
      <p>Here you can change the display order of the columns.</p>
      <DnD.DragDropContext onDragEnd={props.reorder}>
        <DnD.Droppable droppableId="columns" direction="horizontal">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={applyStyles(controlContainerStyle)}
            >
              {columnComponents}
              {provided.placeholder}
            </div>
          )}
        </DnD.Droppable>
      </DnD.DragDropContext>
    </div>
  );
};

function getDraggingStyle(
  dragStyle: DnD.DraggingStyle | DnD.NotDraggingStyle | undefined,
  isDragging: boolean
) {
  if (dragStyle === undefined) {
    return undefined;
  }

  const transform = dragStyle.transform;
  const transitionsTransform = transitionIncludesTransform(
    dragStyle.transition
  );

  if (transform !== null) {
    if (isDragging) {
      if (transitionsTransform) {
        return { ...dragStyle, transform: `${transform} rotate(0)` };
      }

      return { ...dragStyle, transform: `${transform} rotate(10deg)` };
    }
  }

  return dragStyle;
}

function transitionIncludesTransform(transition: string | undefined) {
  if (transition === undefined) {
    return false;
  }

  return /transform/.test(transition);
}
