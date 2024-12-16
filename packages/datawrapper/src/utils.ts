import Case from "case";
import { CleanRecord, QueryKeys } from "./types";
import jsStringEscape from "js-string-escape";
import omit from "lodash/omit";

export function omitKeys<T extends Object>(
  object: T
): Omit<T, "partitionKey" | "sortKey" | "tertiaryKey"> {
  return omit(
    object,
    "partitionKey",
    "sortKey",
    "tertiaryKey",
    // This seems a bit hacky but no reason to ever expose this
    "searchField"
  ) as CleanRecord<T>;
}

export function createKeyString(
  table: string,
  keyOrder: readonly string[],
  keys: Record<string, string>
) {
  let keyString = `#${Case.constant(table)}`;

  keyOrder.forEach((key) => {
    keyString = `${keyString}#${Case.constant(
      jsStringEscape(key)
    )}#${jsStringEscape(keys[key])}`;
  });

  return keyString;
}
