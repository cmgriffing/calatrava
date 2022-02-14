import { DBKeys } from "../types";
import { TableKeyManager } from "../table-key-manager";

enum Tables {
  foo = "foo",
}

const tableKeyManager = new TableKeyManager(
  {
    foo: {
      [DBKeys.Partition]: ["userId"],
    },
  },
  { Foo: "foo" }
);

test("Key manager generates a partition key", () => {
  const partitionKey = tableKeyManager
    .getTable(Tables.foo)
    .getTableKey(DBKeys.Partition, {
      userId: "abc123",
    });
  expect(partitionKey).toMatchSnapshot();
});
