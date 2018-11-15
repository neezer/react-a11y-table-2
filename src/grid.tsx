import { isEmpty, keys, map } from "ramda";
import * as React from "react";
import { Datum, IConfig, IStickyConfig, Styles } from ".";
import { Body } from "./body";
import { Colgroup } from "./colgroup";
import { Column } from "./column";
import { Empty } from "./empty";
import { Head, Ref } from "./head";
import { Table } from "./table";
import { hash } from "./utils";
import { Wrapper } from "./wrapper";

interface IProps {
  config: IConfig;
  data: Datum[];
  styles?: Styles;
  sticky: IStickyConfig;
}

export const Grid: React.FunctionComponent<IProps> = props => {
  const { data, config, styles, sticky } = props;
  const fields = config.order || map(String, keys(config.properties));
  const theadRef = React.createRef<Ref>();

  const columns = map(
    field =>
      new Column({
        config: config.properties[field],
        id: hash(field),
        text: field
      }),
    fields
  );

  if (isEmpty(data)) {
    return <Empty message={config.emptyMessage} />;
  }

  return (
    <Wrapper sticky={sticky} styles={styles} theadRef={theadRef}>
      <Table styles={styles} columns={columns}>
        <Colgroup columns={columns} />
        <Head
          columns={columns}
          styles={styles}
          sticky={sticky}
          ref={theadRef}
        />
        <Body columns={columns} data={data} />
      </Table>
    </Wrapper>
  );
};
