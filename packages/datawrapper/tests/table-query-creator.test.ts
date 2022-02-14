import { DBKeys } from "../types";
import { TableKeyManager } from "./../table-key-manager";
import { TableQueryCreator } from "./../table-query-creator";

enum Tables {
  Foo = "foo",
}

const tableKeyManager = new TableKeyManager(
  {
    [Tables.Foo]: {
      [DBKeys.Partition]: ["userId"],
    },
  },
  { Foo: "foo" }
);

const tableKeyMethods = tableKeyManager.getTable(Tables.Foo);
const tableQueryCreator = new TableQueryCreator(tableKeyMethods);

test("GetAllById", () => {
  const query = tableQueryCreator.getAllById({ userId: "abc123" });
  expect(query).toMatchSnapshot();
});
