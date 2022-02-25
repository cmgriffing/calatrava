import jsStringEscape from "js-string-escape";
import { QueryKeys, DBKeys, GetAllOptions, TableKeyMethods } from "./types";
import { escapeQueryKeys } from "./utils";

export class TableQueryCreator {
  private tableKeyMethods: TableKeyMethods;

  constructor(tableKeyMethods: TableKeyMethods) {
    this.tableKeyMethods = tableKeyMethods;
  }

  scanIdsByFilter(options?: GetAllOptions, index = DBKeys.Partition) {
    const query: any = {
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    };

    if (options?.filterExpression) {
      query.FilterExpression = options?.filterExpression;
    }

    if (options?.filterExpressionNames) {
      query.ExpressionAttributeNames = {
        ...query.ExpressionAttributeNames,
        ...options?.filterExpressionNames,
      };
    }

    if (options?.filterExpressionValues) {
      query.ExpressionAttributeValues = {
        ...query.ExpressionAttributeValues,
        ...options?.filterExpressionValues,
      };
    }

    if (index !== DBKeys.Partition) {
      query.IndexName = index;
    }

    return query;
  }

  getAllById(
    idValue: QueryKeys,
    options?: GetAllOptions,
    index = DBKeys.Partition
  ) {
    index = jsStringEscape(index) as DBKeys;
    idValue = escapeQueryKeys(idValue);
    const key = this.tableKeyMethods.getTableKey(index, idValue);

    const query: any = {
      KeyConditionExpression: `#${index} = :${index}`,
      ExpressionAttributeNames: {
        [`#${index}`]: index,
      },
      ExpressionAttributeValues: {
        [`:${index}`]: key,
      },
    };

    if (options?.filterExpression) {
      query.FilterExpression = options?.filterExpression;
    }

    if (options?.filterExpressionNames) {
      query.ExpressionAttributeNames = {
        ...query.ExpressionAttributeNames,
        ...options?.filterExpressionNames,
      };
    }

    if (options?.filterExpressionValues) {
      query.ExpressionAttributeValues = {
        ...query.ExpressionAttributeValues,
        ...options?.filterExpressionValues,
      };
    }

    if (index !== DBKeys.Partition) {
      query.IndexName = index;
    }

    return query;
  }
  update(
    idValue: QueryKeys,
    patchObject = {},
    secondaryId: QueryKeys = {},
    index = DBKeys.Partition
  ) {
    index = jsStringEscape(index) as DBKeys;
    idValue = escapeQueryKeys(idValue);
    const key = this.tableKeyMethods.getTableKey(index, idValue);
    const patchEntries: string[][] = Object.entries(patchObject);

    if (!patchEntries?.length) {
      // nothing to see here
      return;
    }

    const updateRequest = {
      Key: {
        [index]: key,
      },
      UpdateExpression: "",
      ExpressionAttributeNames: {} as { [key: string]: string },
      ExpressionAttributeValues: {} as { [key: string]: string },
      ReturnValues: "ALL_NEW",
    };

    let baseExpressionString = "";
    patchEntries.forEach(([key, value], index) => {
      if (index === 0) {
        baseExpressionString = `SET `;
      } else {
        baseExpressionString = baseExpressionString + ", ";
      }

      baseExpressionString += `#key${index} = :value${index}`;

      updateRequest.UpdateExpression = baseExpressionString;
      updateRequest.ExpressionAttributeNames[`#key${index}`] = key || "";
      updateRequest.ExpressionAttributeValues[`:value${index}`] = value || "";
    });

    if (secondaryId) {
      const secondaryIndex =
        index === DBKeys.Partition ? DBKeys.Sort : DBKeys.Partition;
      updateRequest.Key[secondaryIndex] = this.tableKeyMethods.getTableKey(
        secondaryIndex,
        secondaryId
      );
    }

    return updateRequest;
  }
  remove(idValue: QueryKeys, secondaryId: QueryKeys, index = DBKeys.Partition) {
    idValue = escapeQueryKeys(idValue);
    const key = this.tableKeyMethods.getTableKey(index, idValue);

    const deleteRequest: any = {
      [index]: key,
    };

    if (secondaryId) {
      const secondaryIndex =
        index === DBKeys.Partition ? DBKeys.Sort : DBKeys.Partition;
      deleteRequest[secondaryIndex] = this.tableKeyMethods.getTableKey(
        secondaryIndex,
        secondaryId
      );
    }

    return deleteRequest;
  }
}
