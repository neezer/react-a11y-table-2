import * as React from "react";
import { Columns } from ".";

interface IProps {
  columns: Columns;
  placeholder?: React.ReactElement<any> | null | undefined;
}

type ColProps = React.HTMLProps<HTMLTableColElement>;

export const Colgroup: React.FunctionComponent<IProps> = props => {
  const { columns, placeholder } = props;

  const cols = columns.map(column => {
    const { width } = column;

    const colProps: ColProps = {
      key: column.id,
      style: { width: `${width + 5}px` }
    };

    return <col {...colProps} />;
  });

  return (
    <colgroup>
      {cols}
      {placeholder}
    </colgroup>
  );
};
