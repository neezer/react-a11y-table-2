import { filter, propEq } from "ramda";

interface IFieldConfig {
  values?: string[];
  width: number;
}

export type PropertiesConfig = Record<string, IFieldConfig>;

interface IProps {
  id: string;
  text: string;
  config: IFieldConfig;
  visible: boolean;
  width?: number;
}

export class Column {
  public static getVisible = filter(propEq("visible", true));
  public static getHidden = filter(propEq("visible", false));

  public id: string;
  public text: string;
  public config: IFieldConfig;
  public visible: boolean;
  public width: number;

  constructor(props: IProps) {
    this.id = props.id;
    this.text = props.text;
    this.config = props.config;
    this.visible = props.visible;
    this.width = props.width || props.config.width;
  }

  public setWidth(newWidth: number) {
    return new Column({
      config: this.config,
      id: this.id,
      text: this.text,
      visible: this.visible,
      width: newWidth
    });
  }

  public toggleVisibility() {
    return new Column({
      config: this.config,
      id: this.id,
      text: this.text,
      visible: !this.visible,
      width: this.width
    });
  }
}
