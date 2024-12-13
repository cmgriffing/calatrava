import jsStringEscape from "js-string-escape";
import { DBKeys, GetAllOptions } from "./types";
import { escapeQueryKeys } from "./utils";

// type Foo = ReturnType<
//   TableKeyManager<
//     Record<string, Record<keyof typeof DBKeys, readonly string[]>>
//   >["getTable"]
// >;

export class TableQueryCreator {
  scanIdsByFilter(options?: GetAllOptions, index = DBKeys.partitionKey) {
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

    if (index !== DBKeys.partitionKey) {
      query.IndexName = index;
    }

    return query;
  }

  getAllById(
    idValue: string,
    options?: GetAllOptions,
    index = DBKeys.partitionKey
  ) {
    index = jsStringEscape(index) as DBKeys;
    idValue = escapeQueryKeys(idValue);

    const query: any = {
      KeyConditionExpression: `#${index} = :${index}`,
      ExpressionAttributeNames: {
        [`#${index}`]: index,
      },
      ExpressionAttributeValues: {
        [`:${index}`]: idValue,
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

    if (index !== DBKeys.partitionKey) {
      query.IndexName = index;
    }

    return query;
  }
  update(
    idValue: string,
    patchObject = {},
    secondaryId?: string,
    index = DBKeys.partitionKey
  ) {
    index = jsStringEscape(index) as DBKeys;
    idValue = escapeQueryKeys(idValue);
    const patchEntries: string[][] = Object.entries(patchObject);

    if (!patchEntries?.length) {
      // nothing to see here
      return;
    }

    const updateRequest = {
      Key: {
        [index]: idValue,
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
      updateRequest.ExpressionAttributeNames[`#key${index}`] = key ?? "";
      updateRequest.ExpressionAttributeValues[`:value${index}`] = value ?? "";
    });

    if (secondaryId) {
      const secondaryIndex =
        index === DBKeys.partitionKey ? DBKeys.sortKey : DBKeys.partitionKey;
      updateRequest.Key[secondaryIndex] = secondaryId;
    }

    return updateRequest;
  }
  remove(idValue: string, secondaryId: string, index = DBKeys.partitionKey) {
    idValue = escapeQueryKeys(idValue);
    const deleteRequest: any = {
      [index]: idValue,
    };

    if (secondaryId) {
      const secondaryIndex =
        index === DBKeys.partitionKey ? DBKeys.sortKey : DBKeys.partitionKey;
      deleteRequest[secondaryIndex] = secondaryId;
    }

    return deleteRequest;
  }
}
