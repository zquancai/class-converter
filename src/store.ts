const store = new Map<Function, Map<string, any>>();

export type StoreItemType = {
  originalKey?: string;
  targetClass?: { new (...args: any[]): any };
  serializer?: (value: any, instance: any) => any;
  deserializer?: (value: any, instance: any, origin: any) => any;
  autoTypeDetection?: boolean;
  optional?: boolean;
};

export type StoreItemOptions = StoreItemType & {
  key: string;
};

export const setStore = (target: Function, options: StoreItemOptions) => {
  const { key, ...rest } = options;
  const storeKey = target.constructor;
  const targetStore = store.has(storeKey) ? store.get(storeKey) : new Map<string, Map<string, StoreItemType>>();
  let value: StoreItemType = targetStore.has(key) ? targetStore.get(key) : {};
  value = {
    ...value,
    ...rest
  };
  targetStore.set(key, value);
  store.set(storeKey, targetStore);
};

export default store;
