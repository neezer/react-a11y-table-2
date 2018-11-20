import { css, Interpolation } from "emotion";
import { murmur3 } from "murmurhash-js";
import { complement, curryN, is, isEmpty, isNil, map, propOr } from "ramda";
import { IConfig, Styles } from ".";
import { Column } from "./column";

export const getStyleFrom = curryN(2, (styles: Styles, name: string) => {
  if (isNil(styles)) {
    return undefined;
  }

  return propOr(undefined, name, styles);
});

export function supports(property: string, value: string) {
  return supportsFeatureDetection() && CSS.supports(property, value);
}

function supportsFeatureDetection() {
  return is(Function, CSS.supports);
}

export function hash(value: string) {
  return String(murmur3(value));
}

export const isNotEmpty = complement(isEmpty);
export const isNotNil = complement(isNil);

export const makeColumns = curryN(2, (config: IConfig, fields: string[]) => {
  const mapColumns = map<string, Column>(
    field =>
      new Column({
        config: config.properties[field],
        id: hash(field),
        text: field,
        visible: true
      })
  );

  return mapColumns(fields);
});

export function applyStyles(styles: Interpolation) {
  return css(styles);
}
