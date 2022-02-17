export enum DBKeys {
  Partition = "partitionKey",
  Sort = "sortKey",
  Tertiary = "tertiaryKey",
}

export interface Datastore {
  put: Function;
  get: Function;
  delete: Function;
  query: Function;
  scan: Function;
  update: Function;
  _doc: {
    batchGet: Function;
  };
}

export type BatchGetKeys = {
  [value in DBKeys]?: string;
};

export interface QueryKeys {
  [key: string]: string;
}

export interface GetAllOptions {
  filterExpression?: string;
  filterExpressionNames?: { [key: string]: string };
  filterExpressionValues?: { [key: string]: string };
  indexKey?: string;
}

export type DBRecord<T> =
  | T
  | { partitionKey: string; sortKey: string; tertiaryKey?: string };

export type CleanRecord<T> = Omit<
  T,
  "partitionKey" | "sortKey" | "tertiaryKey"
>;

export interface WrappedDatastore<T> {
  // GET_EVERYTHING: () => Promise<any>;
  create: (putObject: DBRecord<T>) => Promise<T>;
  getById: (
    idValue: QueryKeys,
    index?: DBKeys,
    secondaryId?: string
  ) => Promise<T>;
  getByIndex: (
    idValue: QueryKeys,
    index?: DBKeys,
    secondaryId?: string
  ) => Promise<T>;
  getRandom: (
    ignoreKey?: string,
    ignoreValue?: string,
    index?: DBKeys
  ) => Promise<T>;
  scanIdsByFilter: (options?: GetAllOptions) => Promise<T[]>;
  getAllById: (
    idValue: QueryKeys,
    options?: GetAllOptions,
    index?: DBKeys,
    secondaryId?: string
  ) => Promise<T[]>;
  getAllByManyIds: (
    idValues: string[],
    idKey: string,
    index?: DBKeys,
    secondaryId?: string
  ) => Promise<T[]>;
  update: (
    idValue: QueryKeys,
    patchObject: Partial<T>,
    secondaryId: QueryKeys,
    index?: DBKeys
  ) => Promise<T>;
  remove: (
    idValue: QueryKeys,
    secondaryId: QueryKeys,
    index?: DBKeys
  ) => Promise<T>;
}
