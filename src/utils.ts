import * as M from "@most/core";
import { mousedown, mousemove, mouseup } from "@most/dom-event";
import { newDefaultScheduler } from "@most/scheduler";
import { Stream } from "@most/types";
import { css, Interpolation } from "emotion";
import { murmur3 } from "murmurhash-js";
import * as R from "ramda";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { Columns, IConfig, ResizeColumns, Styles } from ".";
import { Column } from "./column";

interface IXPos {
  x: number;
}

interface IXColId {
  columnId: string;
}

interface IΔX {
  Δx: number;
}

type IXMove = IXPos & IXColId;
type IΔXChange = IΔX & IXColId;

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
  columns: Columns;
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

    const {
      index: toIndex,
      droppableId: toDroppable
    } = destination as DraggableLocation;

    const { index: fromIndex, droppableId: fromDroppable } = source;
    const isSameDroppable = toDroppable === fromDroppable;
    const droppableChanged = !isSameDroppable;
    const indexChanged = toIndex !== fromIndex;
    const destinationChanged = indexChanged || droppableChanged;
    const visibleChanged = toDroppable === "enabled-columns";
    const hiddenChanged = toDroppable === "disabled-columns";

    if (destinationChanged === false) {
      return;
    }

    if (indexChanged && isSameDroppable && visibleChanged) {
      const column = R.find(R.propEq("id", columnId), visibleColumns) as Column;
      const addAtIndex = R.insert(toIndex, column);
      const removeAtIndex = R.remove<Column>(fromIndex, 1);

      const update = R.pipe(
        removeAtIndex,
        addAtIndex
      );

      const newVisibleColumns = update(visibleColumns);
      const newColumns = R.concat(newVisibleColumns, hiddenColumns);

      setState(R.set(lens, newColumns));
    } else if (droppableChanged && visibleChanged) {
      const column = R.find(R.propEq("id", columnId), hiddenColumns) as Column;
      const addAtIndex = R.insert(toIndex, column.toggleVisibility());
      const removeAtIndex = R.remove<Column>(fromIndex, 1);

      const newHiddenColumns = R.pipe(
        removeAtIndex,
        Column.sort
      )(hiddenColumns);

      const newVisibleColumns = addAtIndex(visibleColumns);
      const newColumns = R.concat(newVisibleColumns, newHiddenColumns);

      setState(R.set(lens, newColumns));
    } else if (droppableChanged && hiddenChanged) {
      const column = R.find(R.propEq("id", columnId), visibleColumns) as Column;
      const addAtIndex = R.insert(toIndex, column.toggleVisibility());
      const removeAtIndex = R.remove<Column>(fromIndex, 1);
      const newVisibleColumns = removeAtIndex(visibleColumns);

      const newHiddenColumns = R.pipe(
        addAtIndex,
        Column.sort
      )(hiddenColumns);

      const newColumns = R.concat(newVisibleColumns, newHiddenColumns);

      setState(R.set(lens, newColumns));
    }
  };
}

export function updateColumnWidth(props: IUpdateVisibleColumnsProps) {
  const { columns } = props;
  const belowBounds = R.lt(R.__, MIN_WIDTH);
  const aboveBounds = R.gt(R.__, MAX_WIDTH);
  const outOfBounds = R.anyPass([belowBounds, aboveBounds]);

  return ({ Δx, columnId }: IΔXChange): Columns => {
    const columnIndex = R.findIndex(R.propEq("id", columnId), columns);
    const column = columns[columnIndex];

    if (column === undefined) {
      return columns;
    }

    let newWidth = column.width + Δx;

    if (outOfBounds(newWidth)) {
      newWidth = belowBounds(newWidth) ? MIN_WIDTH : MAX_WIDTH;
    }

    const updatedColumn = column.setWidth(newWidth);

    return R.set(R.lensIndex(columnIndex), updatedColumn, columns);
  };
}

interface ISetupDragHandlers {
  elements: Array<HTMLElement | null>;
  resize: ResizeColumns;
  columns: Columns;
  endStream: Stream<boolean>;
  end: () => void;
}

export function setupDragHandles(props: ISetupDragHandlers) {
  const { elements, resize, columns, endStream, end } = props;

  elements.forEach(element => {
    if (element === null) {
      return;
    }

    const cursor = changeBodyCursor();

    const mouseupsEffects = (_: MouseEvent) => {
      cursor.restore(_);
      end();
    };

    const effects = (change: IΔXChange) => {
      const updateVisible = updateColumnWidth({ columns });
      const newVisibleColumns = updateVisible(change);

      resize(newVisibleColumns);
    };

    const mousedowns = mousedown(element);
    const mousedownsWithEffects = M.tap(cursor.override, mousedowns);
    const dragStarts = M.map(getColIdAndX, mousedownsWithEffects);
    const mouseups = mouseup(window);
    const mouseupsWithEffects = M.tap(mouseupsEffects, mouseups);
    const mousemoves = mousemove(window);
    const xMoves = M.map(getX, mousemoves);
    const uniqXMoves = M.skipRepeats(xMoves);

    const createDragStream = (move: IXMove) => {
      const ΔxMoves = M.map(getΔX(move), uniqXMoves);

      return M.until(mouseupsWithEffects, ΔxMoves);
    };

    const drags = M.chain(createDragStream, dragStarts);
    const throttledDrags = M.throttle(THROTTLE_IN_MS, drags);
    const dragsWithEffects = M.tap(effects, throttledDrags);
    const disposableDrags = M.until(endStream, dragsWithEffects);

    M.runEffects(disposableDrags, newDefaultScheduler());
  });
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

function changeBodyCursor() {
  const body = document.body;
  const originalCursor = body.style.cursor;

  return {
    override: (_: unknown) => {
      body.style.cursor = "ew-resize";
    },
    restore: (_: unknown) => {
      body.style.cursor = originalCursor;
    }
  };
}
