import { keys, lensProp, map, mergeDeepLeft, set } from "ramda";
import * as React from "react";
import { DropResult } from "react-beautiful-dnd";
import { Column, PropertiesConfig } from "./column";
import { defaultStyles } from "./defaultStyles";
import { Edit } from "./edit";
import { ErrorBoundary } from "./errorBoundary";
import { Grid } from "./grid";
import { Modes } from "./types";
import * as utils from "./utils";
import { Wrapper } from "./wrapper";

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
    const columns = utils.makeColumns(config, fields);
    const mode = props.mode || Modes.View;

    const sticky = {
      enabled: config.stickyHeaders === true,
      supported: utils.supports("position", "sticky")
    };

    this.state = { columns, sticky, mode };
  }

  public render() {
    const { config, data } = this.props;
    const { columns: allColumns, mode, sticky } = this.state;
    const visibleColumns = Column.getVisible(allColumns);
    const styles = mergeDeepLeft(this.props.styles, defaultStyles);
    const setState = this.setState.bind(this);
    const updateProps = { allColumns, lens: this.columnsLens, setState };
    const resize = utils.resizeColumns(updateProps);
    const reorder = utils.reorderColumns(updateProps);

    const editProps = {
      changeMode: this.changeMode,
      columns: allColumns,
      reorder,
      styles
    };

    const gridProps = {
      changeMode: this.changeMode,
      columns: visibleColumns,
      config,
      data,
      resize,
      sticky,
      styles
    };

    return (
      <Wrapper styles={styles}>
        <ErrorBoundary>
          {mode === Modes.Edit && <Edit {...editProps} />}
          {mode === Modes.View && <Grid {...gridProps} />}
        </ErrorBoundary>
      </Wrapper>
    );
  }

  public changeMode: ChangeMode = (newMode: Modes) => {
    this.setState(set(this.modeLens, newMode));
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
export type ResizeColumns = (visibleColumns: Columns) => void;
export type ReorderColumns = (dropResult: DropResult) => void;
export type ToggleColumn = (column: Column) => void;
export type ChangeMode = (mode: Modes) => void;
