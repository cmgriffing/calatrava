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

export function escapeQueryKeys<T extends {}>(queryKeys: T): T {
  const newQueryKeys: QueryKeys = {};
  Object.entries(queryKeys).forEach(([key, value]) => {
    newQueryKeys[key] = jsStringEscape(value);
  });
  return newQueryKeys as T;
}

export function escapedKeyMethod(callback: (queryKeys: QueryKeys) => string) {
  return function (queryKeys: QueryKeys) {
    const escapedQueryKeys = escapeQueryKeys(queryKeys);
    return callback(escapedQueryKeys);
  };
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
