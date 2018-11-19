import {
  find,
  insert,
  isNil,
  keys,
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
import { ColumnReorder } from "./columnReorder";
import { defaultStyles } from "./defaultStyles";
import { ErrorBoundary } from "./errorBoundary";
import { Grid } from "./grid";
import { makeColumns, supports } from "./utils";
import { Wrapper } from "./wrapper";

export enum Modes {
  View = "View",
  Edit = "Edit",
  ReorderColumns = "ReorderColumns"
}

interface IProps {
  config: IConfig;
  data: Datum[];
  styles?: Styles;
  mode?: Modes;
}

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
    const { columns, mode, sticky } = this.state;
    const styles = mergeDeepLeft(this.props.styles, defaultStyles);

    let component = null;

    switch (mode) {
      case Modes.View:
        component = (
          <React.Fragment>
            <Actions styles={styles}>
              <button onClick={this.changeMode(Modes.ReorderColumns)}>
                Re-order Columns
              </button>
            </Actions>
            <Grid
              columns={columns}
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
              <button onClick={this.changeMode(Modes.View)}>
                Save Column Order
              </button>
            </Actions>
            <ColumnReorder
              columns={columns}
              saveNewOrder={this.saveNewOrder}
              styles={styles}
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

  public changeMode = (newMode: Modes) => (
    _: React.MouseEvent<HTMLButtonElement>
  ) => {
    this.setState(set(this.modeLens, newMode));
  };

  public saveNewOrder = (dropResult: DropResult) => {
    const { columns } = this.state;
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

    const column = find(propEq("id", columnId), columns) as Column;
    const addAtIndex = insert(toIndex, column);
    const removeAtIndex = remove<Column>(fromIndex, 1);

    const update = pipe(
      removeAtIndex,
      addAtIndex
    );

    const newColumns = update(columns);

    this.setState(set(this.columnsLens, newColumns));
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
