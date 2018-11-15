import { IConfig } from "../src";

export const config: IConfig = {
  emptyMessage: "bananas",
  order: ["id", "author", "quote"],
  properties: {
    author: { width: 300 },
    id: { width: 20 },
    quote: { width: 600 }
  },
  stickyHeaders: true
};
