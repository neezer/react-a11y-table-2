import { isEmpty } from "ramda";
import * as React from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import * as T from ".";
import { Body } from "./body";
import { Colgroup } from "./colgroup";
import { Empty } from "./empty";
import { GridWrapper } from "./gridWrapper";
import { Head, Ref } from "./head";
import { Table } from "./table";

interface IProps {
  config: T.IConfig;
  data: T.Datum[];
  styles: T.Styles;
  sticky: T.IStickyConfig;
  columns: T.Columns;
  changeMode: T.ChangeMode;
}

export const Grid: React.FunctionComponent<IProps> = props => {
  const { columns, data, config, styles, sticky, changeMode } = props;
  const theadRef = React.createRef<Ref>();

  if (isEmpty(data)) {
    return <Empty message={config.emptyMessage} />;
  }

  const wrapperProps = { sticky, styles, theadRef };
  const headProps = { columns, sticky, styles, theadRef, changeMode };
  const bodyProps = { columns, data, styles };
  const colGroupProps = { columns };
  const tableProps = { columns, styles };

  return (
    <GridWrapper {...wrapperProps}>
      <ContextMenuTrigger id="edit-table-headers">
        <Table {...tableProps}>
          <Colgroup {...colGroupProps} />
          <Head {...headProps} />
          <Body {...bodyProps} />
        </Table>
      </ContextMenuTrigger>
      <ContextMenu id="edit-table-headers">
        <MenuItem onClick={_ => changeMode(T.Modes.Edit)}>Edit</MenuItem>
      </ContextMenu>
    </GridWrapper>
  );
};
