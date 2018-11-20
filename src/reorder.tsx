import * as React from "react";
import * as DnD from "react-beautiful-dnd";
import { Columns, ReorderColumns, Styles } from ".";
import { Column } from "./column";
import { applyStyles, getStyleFrom } from "./utils";

interface IProps {
  columns: Columns;
  styles: Styles;
  reorder: ReorderColumns;
}

export const Reorder: React.FunctionComponent<IProps> = props => {
  const { styles } = props;
  const editStyle = getStyleFrom(styles, "columnReorder");
  const getEditStyle = getStyleFrom(editStyle);
  const columnStyle = getEditStyle("column");
  const controlContainerStyle = getEditStyle("controlContainer");
  const textStyle = getEditStyle("text");
  const wrapperStyle = getEditStyle("wrapper");
  const visibleColumns = Column.getVisible(props.columns);
  const hiddenColumns = Column.getHidden(props.columns);

  const columnComponents = (columns: Columns) =>
    columns.map((column, index) => (
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
    <section>
      <p>Here you can change the display order of the columns.</p>
      <div className={applyStyles(wrapperStyle)}>
        <DnD.DragDropContext onDragEnd={props.reorder}>
          <DnD.Droppable droppableId="enabled-columns">
            {provided => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={applyStyles(controlContainerStyle)}
              >
                {columnComponents(visibleColumns)}
                {provided.placeholder}
              </div>
            )}
          </DnD.Droppable>
          <DnD.Droppable droppableId="disabled-columns">
            {provided => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={applyStyles(controlContainerStyle)}
              >
                {columnComponents(hiddenColumns)}
                {provided.placeholder}
              </div>
            )}
          </DnD.Droppable>
        </DnD.DragDropContext>
      </div>
    </section>
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

      return { ...dragStyle, transform: `${transform} rotate(3deg)` };
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
