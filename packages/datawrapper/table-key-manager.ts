import * as jsStringEscape from "js-string-escape";
import * as Case from "case";
import { DBKeys, QueryKeys } from "./types";

export type TableKeysMap = {
  [key: string]: { [value in DBKeys]?: string[] };
};

export class TableKeyManager {
  private tableKeysMap: TableKeysMap;
  private tableNames: { [key: string]: string };

  constructor(
    tableKeysMap: TableKeysMap,
    tableNames: { [key: string]: string }
  ) {
    this.tableKeysMap = tableKeysMap;
    this.tableNames = tableNames;
  }

  private createKeyString(
    tableName: string,
    keyValueMap: { [key: string]: string | number | boolean }
  ): string {
    if (!Object.values(this.tableNames).includes(tableName)) {
      throw new Error(
        `Could not find table name, ${tableName}, in tableNames map.`
      );
    }

    let keyString = `#${Case.constant(tableName)}`;

    Object.entries(keyValueMap).forEach(([key, value]) => {
      keyString = `${keyString}#${Case.constant(
        jsStringEscape(key)
      )}#${jsStringEscape(value)}`;
    });

    return keyString;
  }

  getTable(table: string) {
    return {
      getTableKey: (
        dbKey: DBKeys,
        keyValueMap: { [key: string]: string | number | boolean }
      ) => {
        // validate keyValueMap
        const allowedKeyNames = this.tableKeysMap[table][dbKey];

        allowedKeyNames.forEach((keyName) => {
          if (!keyValueMap[keyName]) {
            throw new Error(`keyValueMap is missing required key: ${keyName}`);
          }
        });

        if (Object.keys(keyValueMap).length > allowedKeyNames.length) {
          console.warn(
            "Extra keys were passed in the keyValueMap. They will be ignored.",
            { allowedKeyNames, keyValueMap }
          );
        }

        return this.createKeyString(table, keyValueMap);
      },
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
