import * as React from "react";
import { Column, PropertiesConfig } from "./column";
import { ErrorBoundary } from "./errorBoundary";
import { Grid } from "./grid";
import { supports } from "./utils";

interface IProps {
  config: IConfig;
  data: Datum[];
  styles?: Styles;
}

export class Table extends React.Component<IProps, IState> {
  public state: IState = {
    sticky: {
      enabled: this.props.config.stickyHeaders === true,
      supported: supports("position", "sticky")
    }
  };

  public render() {
    return (
      <ErrorBoundary>
        <Grid {...this.props} {...this.state} />
      </ErrorBoundary>
    );
  }
}

export interface IConfig {
  order?: string[];
  properties: PropertiesConfig;
  emptyMessage?: string;
  stickyHeaders?: boolean;
}

export interface IState {
  sticky: IStickyConfig;
}

export interface IStickyConfig {
  enabled: boolean;
  supported: boolean;
}

type PropertyName = string;
type Component = string;
type ClassName = string;

export type DatumValue = string | null | number;
export type Datum = Record<PropertyName, DatumValue> & { id: string };
export type Styles = Record<Component, ClassName>;
export type Columns = Column[];
