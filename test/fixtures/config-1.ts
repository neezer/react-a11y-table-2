import { FieldType, IConfig } from "../../src";

export const config: IConfig = {
  properties: {
    affiliation: {
      type: FieldType.Enum,
      values: ["Death Eaters", "Order of the Phoenix", "Neutral"]
    },
    id: FieldType.Number,
    kind: {
      type: FieldType.Enum,
      values: ["wizard", "witch", "muggle"]
    },
    name: {
      type: FieldType.String
    }
  }
};
