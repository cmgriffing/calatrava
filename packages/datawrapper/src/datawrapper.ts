import jsStringEscape from "js-string-escape";
import { nanoid } from "nanoid";
import {
  Datastore,
  DBKeys,
  QueryKeys,
  DBRecord,
  GetAllOptions,
  WrappedDatastore,
} from "./types";
import { omitKeys } from "./utils";
import { TableKeyManager } from "./table-key-manager";
import { TableQueryCreator } from "./table-query-creator";

// usage: const posts = createDataWrapper<Post>(app.posts)
export function createDataWrapper<ModelType extends {}>(
  datastoreName: string,
  datastore: Datastore,
  _documentClient: any,
  tableKeyManager: TableKeyManager
): WrappedDatastore<ModelType> {
  const tableKeyMethods = tableKeyManager.getTable(datastoreName);
  const tableQueryCreator = new TableQueryCreator(tableKeyMethods);

  return {
    async create(putObject: DBRecord<ModelType>) {
      if (!Object.keys(putObject)?.length) {
        // empty putObject
        return;
      }

      return datastore.put(putObject).then(omitKeys);
    },
    async getById(idValue, index = DBKeys.Partition, _secondaryId) {
      return this.getAllById(idValue, {}, index).then((result: any) => {
        return result[0];
      });
    },
    async getByIndex(idValue, index = DBKeys.Partition, _secondaryId) {
      return this.getAllById(idValue, { indexKey: index }, index).then(
        (result: any) => {
          return result[0];
        }
      );
    },
    async getRandom(
      ignoreKey?: string,
      ignoreValue?: string,
      index = DBKeys.Partition,
      startingKey = nanoid()
    ) {
      index = jsStringEscape(index) as DBKeys;
      let record;
      let scanConfig: any = {
        Limit: 5,
        ExclusiveStartKey: {
          [index]: jsStringEscape(startingKey),
        },
      };

      if (ignoreKey && ignoreValue) {
        scanConfig = {
          ...scanConfig,
          FilterExpression: "#ignoreKey <> :ignoreValue",
          ExpressionAttributeNames: {
            [`#ignoreKey`]: ignoreKey,
          },
          ExpressionAttributeValues: {
            [`:ignoreValue`]: ignoreValue,
          },
        };
      }

      for (let i = 0; i < 5; i++) {
        const scanResult = await datastore.scan(scanConfig);

        if (scanResult.Count > 0) {
          record = scanResult.Items[0];
          break;
        }
      }

      if (!record) {
        return;
      }

      return omitKeys<ModelType>(record) as ModelType;
    },
    async scanIdsByFilter(options?: GetAllOptions, index = DBKeys.Partition) {
      const query = tableQueryCreator.scanIdsByFilter(options, index);

      return datastore
        .scan(query)
        .then((results: { Items: ModelType[] }) => results.Items.map(omitKeys));
    },
    async getAllById(
      idValue: QueryKeys,
      options?: GetAllOptions,
      index = DBKeys.Partition
    ) {
      const query = tableQueryCreator.getAllById(idValue, options, index);

      return datastore.query(query).then((response: any) => {
        return response.Items.map(omitKeys);
      });
    },
    async update(
      idValue: QueryKeys,
      patchObject = {},
      secondaryId: QueryKeys = {},
      index = DBKeys.Partition
    ) {
      const updateRequest = tableQueryCreator.update(
        idValue,
        patchObject,
        secondaryId,
        index
      );

      return datastore
        .update(updateRequest)
        .then((result: { Attributes: ModelType }) =>
          omitKeys(result.Attributes)
        );
    },
    // TODO: Refactor this to one batch request
    async getAllByManyIds(
      idValues: string[],
      idKey: string,
      index = DBKeys.Partition
    ) {
      const options: GetAllOptions = { indexKey: undefined };
      if (index !== DBKeys.Partition) {
        options.indexKey = index;
      }
      const itemsGroupedByKey = await Promise.all(
        idValues.map((idValue) => {
          return this.getAllById({ [idKey]: idValue }, options, index);
        })
      );

      const items: ModelType[] = [];
      itemsGroupedByKey.forEach((itemGroup) => {
        items.push(...itemGroup);
      });

      return items;
    },
    async remove(
      idValue: QueryKeys,
      secondaryId: QueryKeys,
      index = DBKeys.Partition
    ) {
      const deleteRequest = tableQueryCreator.remove(
        idValue,
        secondaryId,
        index
      );

      return datastore.delete(deleteRequest);
    },
  };
}
