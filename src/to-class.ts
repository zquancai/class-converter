import store from './store';
import { JosnType, OriginalStoreItemType, BasicClass, StoreItemType } from './typing';

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
      instance[key] = deserializer ? deserializer(value, instance, jsonObj) : value;
    });
  });
  return instance;
};

const getOriginalKetStore = <T>(Clazz: BasicClass<T>) => {
  let curLayer = Clazz;
  const originalKeyStore = new Map<string, OriginalStoreItemType[]>();
  while (curLayer.name) {
    const targetStore = store.get(curLayer);
    if (targetStore) {
      targetStore.forEach((storeItem: StoreItemType, key: string) => {
        const item = {
          key,
          ...storeItem,
        };
        if (!originalKeyStore.has(storeItem.originalKey)) {
          originalKeyStore.set(storeItem.originalKey, [item]);
        } else {
          const exists = originalKeyStore.get(storeItem.originalKey);
          if (!exists.find((exist: OriginalStoreItemType) => exist.key === key)) {
            originalKeyStore.set(storeItem.originalKey, [...originalKeyStore.get(storeItem.originalKey), item]);
          }
        }
      });
    }
    curLayer = Object.getPrototypeOf(curLayer);
  }
  return originalKeyStore;
};

export const toClasses = <T>(rawJson: JosnType[], Clazz: BasicClass<T>): T[] => {
  return rawJson.map((item: object) => objectToClass<T>(getOriginalKetStore(Clazz), item, Clazz));
};

export const toClass = <T>(rawJson: JosnType, Clazz: BasicClass<T>): T => {
  return objectToClass<T>(getOriginalKetStore(Clazz), rawJson as object, Clazz);
};
