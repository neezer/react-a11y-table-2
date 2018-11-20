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
}

export class Column {
  public static getVisible = filter(propEq("visible", true));
  public static getHidden = filter(propEq("visible", false));

  public id: string;
  public text: string;
  public config: IFieldConfig;
  public visible: boolean;

  constructor(props: IProps) {
    this.id = props.id;
    this.text = props.text;
    this.config = props.config;
    this.visible = props.visible;
  }

  public setWidth(newWidth: number) {
    return new Column({
      config: { ...this.config, width: newWidth },
      id: this.id,
      text: this.text,
      visible: this.visible
    });
  }

  public toggleVisibility() {
    return new Column({
      config: this.config,
      id: this.id,
      text: this.text,
      visible: !this.visible
    });
  }
}
