import * as React from "react";
import { Columns } from ".";

interface IProps {
  columns: Columns;
}

type ColProps = React.HTMLProps<HTMLTableColElement>;

export const Colgroup: React.FunctionComponent<IProps> = props => {
  const { columns } = props;

  const cols = columns.map(column => {
    const { width } = column.config;

    const colProps: ColProps = {
      key: column.id,
      style: { width: `${width}px` }
    };

    return <col {...colProps} />;
  });

  return <colgroup>{cols}</colgroup>;
};
