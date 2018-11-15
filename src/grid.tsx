import {
  find,
  insert,
  isEmpty,
  isNil,
  keys,
  lensProp,
  map,
  over,
  pipe,
  propEq,
  remove
} from "ramda";
import * as React from "react";
import { DraggableLocation, DropResult } from "react-beautiful-dnd";
import { Columns, Datum, IConfig, IStickyConfig, Styles } from ".";
import { Body } from "./body";
import { Colgroup } from "./colgroup";
import { Column } from "./column";
import { Empty } from "./empty";
import { Head, Ref } from "./head";
import { Table } from "./table";
import { makeColumns } from "./utils";
import { Wrapper } from "./wrapper";

interface IProps {
  config: IConfig;
  data: Datum[];
  styles?: Styles;
  sticky: IStickyConfig;
}

interface IState {
  fields: string[];
}

export class Grid extends React.Component<IProps, IState> {
  public state: IState = {
    fields:
      this.props.config.order || map(String, keys(this.props.config.properties))
  };

  private fieldsLens = lensProp("fields");

  public render() {
    const { data, config, styles, sticky } = this.props;
    const { fields } = this.state;
    const theadRef = React.createRef<Ref>();
    const columns = makeColumns(config, fields);

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
            onReorder={this.saveNewOrder(columns)}
            ref={theadRef}
          />
          <Body columns={columns} data={data} />
        </Table>
      </Wrapper>
    );
  }

  public saveNewOrder = (columns: Columns) => (dropResult: DropResult) => {
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
    const addAtIndex = insert(toIndex, column.text);
    const removeAtIndex = remove<string>(fromIndex, 1);

    const update = over(
      this.fieldsLens,
      pipe(
        removeAtIndex,
        addAtIndex
      )
    );

    this.setState(update);
  };
}
