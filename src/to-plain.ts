import { isArray } from 'lodash';
import store from './store';
import { JosnType, BasicClass, StoreItemType } from './typing';

const classToObject = <T>(keyStore: Map<string, StoreItemType>, instance: JosnType, Clazz: BasicClass<T>): JosnType => {
  const obj: JosnType = {};
  keyStore.forEach((propertiesOption: StoreItemType, key: keyof JosnType) => {
    const instanceValue = instance[key];
    const { originalKey, serializer, targetClass, optional, array, dimension } = propertiesOption;
    if (instanceValue === undefined) {
      if (!optional) {
        throw new Error(`Cannot map '${originalKey}' to ${Clazz.name}.${key}, property '${originalKey}' not found`);
      }
      return;
    }
    let value = instanceValue;
    if (targetClass) {
      if (array) {
        if (dimension === 1) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          value = toPlains(instanceValue, targetClass);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          value = instanceValue.map((cur: any) => toPlains(cur, targetClass));
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        value = toPlain(instanceValue, targetClass);
      }
    }
    obj[originalKey] = serializer ? serializer(value, instance, obj) : value;
  });
  return obj;
};

const getKeyStore = <T>(Clazz: BasicClass<T>) => {
  let curLayer = Clazz;
  const keyStore = new Map<string, StoreItemType>();
  while (curLayer.name) {
    const targetStore = store.get(curLayer);
    if (targetStore) {
      targetStore.forEach((storeItem: StoreItemType, key: string) => {
        if (!keyStore.has(key)) {
          keyStore.set(key, storeItem);
        }
      });
    }
    curLayer = Object.getPrototypeOf(curLayer);
  }
  return keyStore;
};

export const toPlains = <T>(instances: (T | JosnType)[], Clazz: BasicClass<T>): any[] => {
  if (!isArray(instances)) {
    throw new Error(`${Clazz} instances must be a array`);
  }
  return instances.map((item: JosnType) => classToObject<T>(getKeyStore(Clazz), item, Clazz));
};

export const toPlain = <T>(instance: T | JosnType, Clazz: BasicClass<T>): any => {
  return classToObject<T>(getKeyStore(Clazz), instance, Clazz);
};
