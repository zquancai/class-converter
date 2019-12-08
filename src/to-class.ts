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
  Clazz: BasicClass<T>,
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
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        value = toClass(originalValue, targetClass);
      }
      instance[key] = deserializer(value, instance, jsonObj);
    });
  });
  return instance;
};

const getOriginalKetStore = <T>(targetStore: Map<string, StoreItemType>) => {
  const originalKeyStore = new Map<string, OriginalStoreItemType[]>();
  targetStore.forEach((storeItem: StoreItemType, key: string) => {
    const item = {
      key,
      deserializer: (value: any) => value,
      ...storeItem,
    };
    originalKeyStore.set(
      storeItem.originalKey,
      originalKeyStore.has(storeItem.originalKey) ? [...originalKeyStore.get(storeItem.originalKey), item] : [item],
    );
  });
  return originalKeyStore;
};

export const toClasses = <T>(rawJson: { [key: string]: any }[], Clazz: BasicClass<T>): T[] => {
  const targetStore = store.get(Clazz);
  if (!targetStore) {
    return rawJson as any;
  }
  return rawJson.map((item: object) => objectToClass<T>(getOriginalKetStore(targetStore), item, Clazz));
};

export const toClass = <T>(rawJson: { [key: string]: any }, Clazz: BasicClass<T>): T => {
  const targetStore = store.get(Clazz);
  if (!targetStore) {
    return rawJson as any;
  }
  return objectToClass<T>(getOriginalKetStore(targetStore), rawJson as object, Clazz);
};
