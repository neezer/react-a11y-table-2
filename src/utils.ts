import { murmur3 } from "murmurhash-js";
import { curryN, is, isNil, propOr } from "ramda";
import { Styles } from ".";

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
