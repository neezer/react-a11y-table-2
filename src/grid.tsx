import { isEmpty } from "ramda";
import * as React from "react";
import { Columns, Datum, IConfig, IStickyConfig, Styles } from ".";
import { Body } from "./body";
import { Colgroup } from "./colgroup";
import { Empty } from "./empty";
import { GridWrapper } from "./gridWrapper";
import { Head, Ref } from "./head";
import { Table } from "./table";

interface IProps {
  config: IConfig;
  data: Datum[];
  styles: Styles;
  sticky: IStickyConfig;
  columns: Columns;
}

export const Grid: React.FunctionComponent<IProps> = props => {
  const { columns, data, config, styles, sticky } = props;
  const theadRef = React.createRef<Ref>();

  if (isEmpty(data)) {
    return <Empty message={config.emptyMessage} />;
  }

  const wrapperProps = { sticky, styles, theadRef };
  const headProps = { columns, sticky, styles, theadRef };
  const bodyProps = { columns, data, styles };
  const colGroupProps = { columns };
  const tableProps = { columns, styles };

  return (
    <GridWrapper {...wrapperProps}>
      <Table {...tableProps}>
        <Colgroup {...colGroupProps} />
        <Head {...headProps} />
        <Body {...bodyProps} />
      </Table>
    </GridWrapper>
  );
};
