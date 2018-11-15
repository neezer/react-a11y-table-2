interface IFieldConfig {
  values?: string[];
  width: number;
}

export type PropertiesConfig = Record<string, IFieldConfig>;

interface IProps {
  id: string;
  text: string;
  config: IFieldConfig;
}

export class Column {
  public id: string;
  public text: string;
  public config: IFieldConfig;

  constructor(props: IProps) {
    this.id = props.id;
    this.text = props.text;
    this.config = props.config;
  }
}
