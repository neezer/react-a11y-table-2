import { css, Interpolation } from "emotion";
import { murmur3 } from "murmurhash-js";
import * as R from "ramda";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { Columns, IConfig, Styles } from ".";
import { Column } from "./column";

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
const MIN_WIDTH = 30;
const MAX_WIDTH = 1000;

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
        visible: true,
        width: config.properties[field].width
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

interface IUpdateVisibleColumnsProps {
  visibleColumns: Columns;
}

export function resizeColumns(props: IUpdateColumnsProps) {
  const { allColumns, lens, setState } = props;

  return (newVisibleColumns: Columns) => {
    const hiddenColumns = Column.getHidden(allColumns);
    const newColumns = R.concat(newVisibleColumns, hiddenColumns);

    setState(R.set(lens, newColumns));
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

export function updateColumnWidth(props: IUpdateVisibleColumnsProps) {
  const { visibleColumns } = props;

  return ({ Δx, columnId }: IΔXChange): Columns => {
    const inBounds = R.allPass([R.gte(MAX_WIDTH), R.lte(MIN_WIDTH)]);
    const outOfBounds = R.complement(inBounds);
    const columnIndex = R.findIndex(R.propEq("id", columnId), visibleColumns);
    const column = visibleColumns[columnIndex];

    if (column === undefined) {
      return visibleColumns;
    }

    const newWidth = column.width + Δx;

    if (outOfBounds(newWidth)) {
      return visibleColumns;
    }

    const updatedColumn = column.setWidth(newWidth);

    return R.set(R.lensIndex(columnIndex), updatedColumn, visibleColumns);
  };
}
