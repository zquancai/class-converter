import 'reflect-metadata';
import store, { StoreItemType } from './store';

export type BasicClass<T> = {
  new (...args: any[]): T;
};

export type OriginalStoreItemType = StoreItemType & {
  key: string;
};

const objectToClass = <T>(
  originalKeyStore: Map<string, OriginalStoreItemType[]>,
  jsonObj: { [key: string]: any },
  Clazz: BasicClass<T>
): T => {
  const instance: any = new Clazz();
  originalKeyStore.forEach((propertiesOption: OriginalStoreItemType[], originalKey) => {
    const originalValue = jsonObj[originalKey];
    propertiesOption.forEach(({ key, deserializer, targetClass, optional }: OriginalStoreItemType) => {
      if (originalValue === undefined) {
        if (!optional) {
          throw new Error(`Cannot map '${originalKey}' to ${Clazz.name}.${key}, property '${originalKey}' not found`);
        }
        return;
      }
      let value = originalValue;
      if (targetClass) {
        value = toClass(originalValue, targetClass);
      }
      instance[key] = deserializer(value, instance, jsonObj);
    });
  });
  return instance;
};

export const toClass = <T>(rawJson: object | object[], Clazz: BasicClass<T>): T | T[] => {
  const targetStore = store.get(Clazz);
  if (!targetStore) {
    return rawJson as any;
  }
  const originalKeyStore = new Map<string, OriginalStoreItemType[]>();
  targetStore.forEach((value: StoreItemType, key: string) => {
    const item = {
      key,
      deserializer: (value: any) => value,
      ...value
    };
    originalKeyStore.set(
      value.originalKey,
      originalKeyStore.has(value.originalKey) ? [...originalKeyStore.get(value.originalKey), item] : [item]
    );
  });
  if (Array.isArray(rawJson)) {
    return rawJson.map(item => objectToClass<T>(originalKeyStore, item, Clazz));
  }
  return objectToClass<T>(originalKeyStore, rawJson as object, Clazz);
};
