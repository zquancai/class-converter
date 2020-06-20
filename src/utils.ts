import { StoreItemOptions, StoreItemType, BasicClass } from './typing';
import store from './store';

export const isNull = (val: any) => val === null;

export const isUndefined = (val: any) => val === undefined;

export const isNullOrUndefined = (val: any) => isNull(val) || isUndefined(val);

export const getOriginalKetStore = <T>(Clazz: BasicClass<T>) => {
  let curLayer = Clazz;
  const originalKeyStore = new Map<string, StoreItemOptions[]>();
  while (curLayer.name && curLayer.prototype) {
    const { constructor } = curLayer.prototype;
    const targetStore = store.get(constructor);
    if (targetStore) {
      targetStore.forEach((storeItem, key) => {
        const item = {
          key,
          ...storeItem,
        };
        if (!originalKeyStore.has(storeItem.originalKey)) {
          originalKeyStore.set(storeItem.originalKey, [item]);
        } else {
          const exists = originalKeyStore.get(storeItem.originalKey);
          if (!exists.find((exist: StoreItemOptions) => exist.key === key)) {
            originalKeyStore.set(storeItem.originalKey, [...originalKeyStore.get(storeItem.originalKey), item]);
          }
        }
      });
    }
    curLayer = Object.getPrototypeOf(constructor);
  }
  return originalKeyStore;
};

export const getKeyStore = <T>(Clazz: BasicClass<T>) => {
  const keyStore = new Map<string, StoreItemType>();
  const originalKeyStore = getOriginalKetStore(Clazz);
  originalKeyStore.forEach(storeItems => {
    const [firstStoreItem] = storeItems;
    if (storeItems.length === 1) {
      keyStore.set(firstStoreItem.key, firstStoreItem);
    } else {
      const hasStoreItems = storeItems.filter(storeItem => storeItem.serializeTarget);
      if (hasStoreItems.length !== 1) {
        throw new Error(
          `Only one of keys(${storeItems.map(storeItem => storeItem.key).join(', ')}) in ${
            Clazz.name
          } can contain a serializeTarget when use toPlain`,
        );
      }
      const hasStoreItem = hasStoreItems[0];
      keyStore.set(hasStoreItem.key, hasStoreItem);
    }
  });
  return keyStore;
};
