import jsStringEscape from "js-string-escape";
import * as Case from "case";
import { DBKeys } from "./types";

// export type TableKeysMap = {
//   [key: string]: { [value in DBKeys]?: string[] };
// };

export class TableKeyManager<
  TableKeysMap extends Record<
    string,
    Record<keyof typeof DBKeys, readonly string[]>
  >
> {
  private tableKeysMap: TableKeysMap;

  constructor(tableKeysMap: TableKeysMap) {
    this.tableKeysMap = tableKeysMap;
  }

  private createKeyString<
    K extends keyof typeof DBKeys,
    TableKeysMap extends Record<
      string,
      Record<keyof typeof DBKeys, readonly string[]>
    >,
    TableKey extends keyof TableKeysMap
  >(
    table: TableKey,
    dbKey: DBKeys,
    keyMap: TableKeysMap,
    keys: Record<TableKeysMap[TableKey][K][number], string>
  ) {
    let keyString = `#${Case.constant(String(table))}`;

    Object.entries(keyMap[table]![dbKey])
      .sort((entryA, entryB) => {
        if (entryA[0] > entryB[0]) {
          return 1;
        } else if (entryA[0] < entryB[0]) {
          return -1;
        } else {
          return 0;
        }
      })
      .forEach(([key, value]) => {
        keyString = `${keyString}#${Case.constant(
          jsStringEscape(value)
        )}#${jsStringEscape((keys as any)[value])}`;
      });

    return keyString;
  }

  getTable(table: keyof TableKeysMap) {
    const createGetTableKey = (dbKey: DBKeys) => {
      return (
        keyValueMap: Record<
          TableKeysMap[typeof table][keyof typeof DBKeys][number],
          string
        >
      ) => {
        // validate keyValueMap
        const allowedKeyNames = this.tableKeysMap?.[table]?.[dbKey] || [];

        allowedKeyNames.forEach((keyName) => {
          // This cast could be buggy until we test it
          const typedkeyName =
            keyName as TableKeysMap[typeof table][keyof typeof DBKeys][number];

          if (!keyValueMap[typedkeyName]) {
            throw new Error(
              `keyValueMap is missing required key: ${String(
                keyName
              )}, table: ${String(
                table
              )}, dbKey: ${dbKey}, keyValueMap: ${JSON.stringify(keyValueMap)}`
            );
          }
        });

        if (Object.keys(keyValueMap).length > allowedKeyNames.length) {
          console.warn(
            "Extra keys were passed in the keyValueMap. They will be ignored.",
            { allowedKeyNames, keyValueMap, table, dbKey }
          );
        }

        return this.createKeyString(
          String(table),
          dbKey,
          this.tableKeysMap,
          keyValueMap
        );
      };
    };

    return {
      getPartitionKey: createGetTableKey(DBKeys.partitionKey),
      getSortKey: createGetTableKey(DBKeys.sortKey),
      getTertiaryKey: createGetTableKey(DBKeys.tertiaryKey),
      getQuaternaryKey: createGetTableKey(DBKeys.quaternaryKey),
    };
  }
}

// end-user examples

// enum Tables {
//   foo = "foo",
// }

// const tables = arc.tables();

// const ourTableMeta = new TableKeyManager(
//   {
//     foo: {
//       [DBKeys.Partition]: ["userId"],
//     },
//   },
//   { Foo: "foo" }
// );

// const partitionKey = ourTableMeta
//   .getTable(Tables.foo)
//   .getTableKey(DBKeys.Partition, {
//     foo: "bar",
//   });
