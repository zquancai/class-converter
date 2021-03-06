import { StoreItemOptions, StoreItemType, BasicClass } from './typing';
import store, { keyStores, originalKeyStores } from './store';

export const isNull = (val: any) => val === null;

export const isUndefined = (val: any) => val === undefined;

export const isNullOrUndefined = (val: any) => isNull(val) || isUndefined(val);

export const getOriginalKeyStore = <T>(Clazz: BasicClass<T>) => {
  let curLayer = Clazz;
  const cacheOriginalKeyStore = originalKeyStores.get(curLayer);
  if (cacheOriginalKeyStore) {
    return cacheOriginalKeyStore;
  }
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
  originalKeyStores.set(Clazz, originalKeyStore);
  return originalKeyStore;
};

export const getKeyStore = <T>(Clazz: BasicClass<T>) => {
  const cacheKeyStore = keyStores.get(Clazz);
  if (cacheKeyStore) {
    return cacheKeyStore;
  }
  const keyStore = new Map<string, StoreItemType>();
  const originalKeyStore = getOriginalKeyStore(Clazz);
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
  keyStores.set(Clazz, keyStore);
  return keyStore;
};
