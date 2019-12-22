export type StoreItemType = {
  originalKey?: string;
  targetClass?: { new (...args: any[]): any };
  serializer?: (value: any, instance: any, origina: any) => any;
  deserializer?: (value: any, instance: any, origin: any) => any;
  autoTypeDetection?: boolean;
  optional?: boolean;
  array?: boolean;
  dimension?: DimensionRange;
};

export type StoreItemOptions = StoreItemType & {
  key: string;
};

export type BasicClass<T> = {
  new (...args: any[]): T;
};

export type JosnType = { [key: string]: any };

export type OriginalStoreItemType = StoreItemType & {
  key: string;
};

export type DimensionRange = 1 | 2;
