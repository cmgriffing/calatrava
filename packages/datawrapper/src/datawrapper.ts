import jsStringEscape from "js-string-escape";
import { nanoid } from "nanoid";
import { Datastore, DBKeys, DBRecord, GetAllOptions } from "./types";
import { omitKeys } from "./utils";
import { TableQueryCreator } from "./table-query-creator";

export type WrappedDatastore<T extends {}> = ReturnType<
  typeof createDataWrapper<T>
>;

// usage: const posts = createDataWrapper<Post>(app.posts)
export function createDataWrapper<ModelType extends {}>(
  datastore: Datastore,
  _documentClient: any
) {
  const tableQueryCreator = new TableQueryCreator();

  return {
    async create(putObject: DBRecord<ModelType>) {
      if (!Object.keys(putObject)?.length) {
        // empty putObject
        return;
      }

      return datastore.put(putObject).then(omitKeys) as Promise<ModelType>;
    },
    async getById(
      idValue: string,
      index = DBKeys.partitionKey,
      _secondaryId?: string
    ) {
      return this.getAllById(idValue, {}, index).then((result: any) => {
        return result[0];
      }) as Promise<ModelType>;
    },
    async getByIndex(
      idValue: string,
      index = DBKeys.partitionKey,
      _secondaryId?: string
    ) {
      return this.getAllById(idValue, { indexKey: index }, index).then(
        (result: any) => {
          return result[0];
        }
      ) as Promise<ModelType>;
    },
    async getRandom(
      ignoreKey?: string,
      ignoreValue?: string,
      index = DBKeys.partitionKey,
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
    async scanIdsByFilter(
      options?: GetAllOptions,
      index = DBKeys.partitionKey
    ) {
      const query = tableQueryCreator.scanIdsByFilter(options, index);

      return datastore
        .scan(query)
        .then((results: { Items: ModelType[] }) =>
          results.Items.map(omitKeys)
        ) as Promise<ModelType[]>;
    },
    async getAllById(
      idValue: string,
      options?: GetAllOptions,
      index = DBKeys.partitionKey
    ) {
      const query = tableQueryCreator.getAllById(idValue, options, index);

      return datastore.query(query).then((response: any) => {
        return response.Items.map(omitKeys);
      }) as Promise<ModelType[]>;
    },
    async update(
      idValue: string,
      patchObject = {},
      secondaryId: string,
      index = DBKeys.partitionKey
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
        ) as Promise<ModelType>;
    },
    // TODO: Refactor this to one batch request
    async getAllByManyIds(idValues: string[], index = DBKeys.partitionKey) {
      const options: GetAllOptions = { indexKey: undefined };
      if (index !== DBKeys.partitionKey) {
        options.indexKey = index;
      }
      const itemsGroupedByKey = await Promise.all(
        idValues.map((idValue) => {
          return this.getAllById(idValue, options, index);
        })
      );

      const items: ModelType[] = [];
      itemsGroupedByKey.forEach((itemGroup) => {
        items.push(...itemGroup);
      });

      return items;
    },
    async remove(
      idValue: string,
      secondaryId: string,
      index = DBKeys.partitionKey
    ) {
      const deleteRequest = tableQueryCreator.remove(
        idValue,
        secondaryId,
        index
      );

      return datastore.delete(deleteRequest) as Promise<void>;
    },
  };
}
