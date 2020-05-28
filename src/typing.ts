export type StoreItemType = {
  originalKey?: string;
  targetClass?: BasicClass;
  serializer?: (value: any, instance: any, origin: any, options: ToPlainOptions) => any;
  disallowIgnoreSerializer?: boolean;
  afterSerializer?: (value: any, instance: any, origin: any, options: ToPlainOptions) => any;
  disallowIgnoreAfterSerializer?: boolean;
  deserializer?: (value: any, instance: any, origin: any, options: ToClassOptions) => any;
  disallowIgnoreDeserializer?: boolean;
  beforeDeserializer?: (value: any, instance: any, origin: any, options: ToClassOptions) => any;
  disallowIgnoreBeforeDeserializer?: boolean;
  default?: any;
  autoTypeDetection?: boolean;
  optional?: boolean;
  serializeTarget?: boolean;
  array?: boolean;
  dimension?: DimensionRange;
};

export type StoreItemOptions = StoreItemType & {
  key: string;
};

export type BasicClass<T = any> = {
  new (...args: any[]): T;
};

export type JosnType = { [key: string]: any };

export type DimensionRange = 1 | 2;

export interface ToClassOptions {
  ignoreDeserializer?: boolean;
  ignoreBeforeDeserializer?: boolean;
}

export interface ToPlainOptions {
  ignoreSerializer?: boolean;
  ignoreAfterSerializer?: boolean;
}
