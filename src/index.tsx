import {
  concat,
  filter,
  find,
  findIndex,
  insert,
  isNil,
  keys,
  lensPath,
  lensProp,
  map,
  mergeDeepLeft,
  pipe,
  propEq,
  remove,
  set
} from "ramda";
import * as React from "react";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { Actions } from "./actions";
import { Column, PropertiesConfig } from "./column";
import { ColumnPicker } from "./columnPicker";
import { ColumnReorder } from "./columnReorder";
import { ColumnResize } from "./columnResize";
import { defaultStyles } from "./defaultStyles";
import { ErrorBoundary } from "./errorBoundary";
import { Grid } from "./grid";
import { applyStyles, getStyleFrom, makeColumns, supports } from "./utils";
import { Wrapper } from "./wrapper";

export enum Modes {
  View = "View",
  Edit = "Edit",
  ReorderColumns = "ReorderColumns",
  ResizeColumns = "ResizeColumns",
  PickColumns = "PickColumns"
}

interface IProps {
  config: IConfig;
  data: Datum[];
  styles?: Styles;
  mode?: Modes;
}

const getVisibleColumns = filter(propEq("visible", true));
const getHiddenColumns = filter(propEq("visible", false));

export class Table extends React.Component<IProps, IState> {
  private columnsLens = lensProp("columns");
  private modeLens = lensProp("mode");

  public constructor(props: IProps) {
    super(props);

    const { config } = props;
    const fields = config.order || map(String, keys(config.properties));
    const columns = makeColumns(config, fields);
    const mode = props.mode || Modes.View;

    const sticky = {
      enabled: config.stickyHeaders === true,
      supported: supports("position", "sticky")
    };

    this.state = { columns, sticky, mode };
  }

  public render() {
    const { config, data } = this.props;
    const { columns: allColumns, mode, sticky } = this.state;
    const visibleColumns = getVisibleColumns(allColumns);
    const styles = mergeDeepLeft(this.props.styles, defaultStyles);
    const actionsStyle = getStyleFrom(styles, "actions");
    const buttonStyle = getStyleFrom(actionsStyle, "button");

    let component = null;

    switch (mode) {
      case Modes.View:
        component = (
          <React.Fragment>
            <Actions styles={styles}>
              <button
                onClick={this.changeMode(Modes.ReorderColumns)}
                className={applyStyles(buttonStyle)}
              >
                Re-order Columns
              </button>
              <button
                onClick={this.changeMode(Modes.ResizeColumns)}
                className={applyStyles(buttonStyle)}
              >
                Resize Columns
              </button>
              <button
                onClick={this.changeMode(Modes.PickColumns)}
                className={applyStyles(buttonStyle)}
              >
                Show/Hide Columns
              </button>
            </Actions>
            <Grid
              columns={visibleColumns}
              config={config}
              data={data}
              sticky={sticky}
              styles={styles}
            />
          </React.Fragment>
        );

        break;

      case Modes.ReorderColumns:
        component = (
          <React.Fragment>
            <Actions styles={styles}>
              <button
                onClick={this.changeMode(Modes.View)}
                className={applyStyles(buttonStyle)}
              >
                Save Column Order
              </button>
            </Actions>
            <ColumnReorder
              columns={visibleColumns}
              saveNewOrder={this.saveNewOrder}
              styles={styles}
            />
          </React.Fragment>
        );

        break;

      case Modes.ResizeColumns:
        component = (
          <React.Fragment>
            <Actions styles={styles}>
              <button
                onClick={this.changeMode(Modes.View)}
                className={applyStyles(buttonStyle)}
              >
                Save Column Sizes
              </button>
            </Actions>
            <ColumnResize
              columns={visibleColumns}
              styles={styles}
              resize={this.resizeColumns}
            />
          </React.Fragment>
        );

        break;

      case Modes.PickColumns:
        component = (
          <React.Fragment>
            <Actions styles={styles}>
              <button
                onClick={this.changeMode(Modes.View)}
                className={applyStyles(buttonStyle)}
              >
                Save Column Visibility
              </button>
            </Actions>
            <ColumnPicker
              columns={allColumns}
              styles={styles}
              toggle={this.toggleColumn}
            />
          </React.Fragment>
        );

        break;
    }

    return (
      <Wrapper styles={styles}>
        <ErrorBoundary>{component}</ErrorBoundary>
      </Wrapper>
    );
  }

  public toggleColumn = (column: Column) => (
    _: React.ChangeEvent<HTMLInputElement>
  ) => {
    const index = findIndex(col => col.id === column.id, this.state.columns);
    const lens = lensPath(["columns", index]);
    const update = set(lens, column.toggleVisibility());

    this.setState(update);
  };

  public changeMode = (newMode: Modes) => (
    _: React.MouseEvent<HTMLButtonElement>
  ) => {
    this.setState(set(this.modeLens, newMode));
  };

  public saveNewOrder = (dropResult: DropResult) => {
    const { columns: allColumns } = this.state;
    const visibleColumns = getVisibleColumns(allColumns);
    const hiddenColumns = getHiddenColumns(allColumns);
    const { destination, source, draggableId: columnId } = dropResult;
    const lacksDestination = isNil(destination);

    if (lacksDestination) {
      return;
    }

    const { index: toIndex } = destination as DraggableLocation;
    const { index: fromIndex } = source;
    const destinationChanged = toIndex !== fromIndex;

    if (destinationChanged === false) {
      return;
    }

    const column = find(propEq("id", columnId), visibleColumns) as Column;
    const addAtIndex = insert(toIndex, column);
    const removeAtIndex = remove<Column>(fromIndex, 1);

    const update = pipe(
      removeAtIndex,
      addAtIndex
    );

    const newColumns = update(visibleColumns);

    this.setState(set(this.columnsLens, concat(newColumns, hiddenColumns)));
  };

  public resizeColumns = (newColumnWidths: number[]) => {
    const { columns: allColumns } = this.state;
    const visibleColumns = getVisibleColumns(allColumns);
    const hiddenColumns = getHiddenColumns(allColumns);

    const newColumns = visibleColumns.map((column, index) =>
      column.setWidth(newColumnWidths[index])
    );

    this.setState(set(this.columnsLens, concat(newColumns, hiddenColumns)));
  };
}

export interface IConfig {
  order?: string[];
  properties: PropertiesConfig;
  emptyMessage?: string;
  stickyHeaders?: boolean;
}

export interface IState {
  sticky: IStickyConfig;
  columns: Columns;
  mode: Modes;
}

export interface IStickyConfig {
  enabled: boolean;
  supported: boolean;
}

type PropertyName = string;
type Component = string;
type Style = object;

export type DatumValue = string | null | number;
export type Datum = Record<PropertyName, DatumValue> & { id: string };
export type Styles = Record<Component, Style>;
export type Columns = Column[];
