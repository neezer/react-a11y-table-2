import { css, Interpolation } from "emotion";
import { murmur3 } from "murmurhash-js";
import * as R from "ramda";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { Columns, IConfig, Styles } from ".";
import { Column } from "./column";

export const getStyleFrom = R.curryN(2, (styles: Styles, name: string) => {
  if (R.isNil(styles)) {
    return undefined;
  }

  return R.propOr(undefined, name, styles);
});

export function supports(property: string, value: string) {
  return supportsFeatureDetection() && CSS.supports(property, value);
}

function supportsFeatureDetection() {
  return R.is(Function, CSS.supports);
}

export function hash(value: string) {
  return String(murmur3(value));
}

export const isNotEmpty = R.complement(R.isEmpty);
export const isNotNil = R.complement(R.isNil);

export const makeColumns = R.curryN(2, (config: IConfig, fields: string[]) => {
  const mapColumns = R.map<string, Column>(
    field =>
      new Column({
        config: config.properties[field],
        id: hash(field),
        text: field,
        visible: true
      })
  );

  return mapColumns(fields);
});

export function applyStyles(styles: Interpolation) {
  return css(styles);
}

interface IUpdateColumnsProps {
  allColumns: Columns;
  lens: R.Lens;
  setState: <S>(state: S) => void;
}

export function resizeColumns(props: IUpdateColumnsProps) {
  const { allColumns, lens, setState } = props;

  return (newColumnWidths: number[]) => {
    const visibleColumns = Column.getVisible(allColumns);
    const hiddenColumns = Column.getHidden(allColumns);

    const newColumns = visibleColumns.map((column, index) =>
      column.setWidth(newColumnWidths[index])
    );

    setState(R.set(lens, R.concat(newColumns, hiddenColumns)));
  };
}

export function reorderColumns(props: IUpdateColumnsProps) {
  const { allColumns, lens, setState } = props;

  return (dropResult: DropResult) => {
    const visibleColumns = Column.getVisible(allColumns);
    const hiddenColumns = Column.getHidden(allColumns);
    const { destination, source, draggableId: columnId } = dropResult;
    const lacksDestination = R.isNil(destination);

    if (lacksDestination) {
      return;
    }

    const { index: toIndex } = destination as DraggableLocation;
    const { index: fromIndex } = source;
    const destinationChanged = toIndex !== fromIndex;

    if (destinationChanged === false) {
      return;
    }

    const column = R.find(R.propEq("id", columnId), visibleColumns) as Column;
    const addAtIndex = R.insert(toIndex, column);
    const removeAtIndex = R.remove<Column>(fromIndex, 1);

    const update = R.pipe(
      removeAtIndex,
      addAtIndex
    );

    const newColumns = update(visibleColumns);

    setState(R.set(lens, R.concat(newColumns, hiddenColumns)));
  };
}

export function toggleColumn(props: IUpdateColumnsProps) {
  const { allColumns, lens, setState } = props;

  return (column: Column) => {
    const index = R.findIndex(col => col.id === column.id, allColumns);

    const newColumns = R.set(
      R.lensIndex(index),
      column.toggleVisibility(),
      allColumns
    );

    setState(R.set(lens, newColumns));
  };
}
