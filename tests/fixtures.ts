import { ImportMock } from 'ts-mock-imports';
import * as store from '../src/store';
import { StoreItemType, BasicClass, StoreItemOptions } from '../src/typing';

export interface ClazzOptions {
  clazz: BasicClass;
  storeItems: { key: string; item: StoreItemType }[];
}

export const mockStore = (clazzOptions: ClazzOptions[] = []) => {
  const expectStore = new Map();
  clazzOptions.forEach(clazzoption => {
    const clazzStore = new Map();
    clazzoption.storeItems.forEach(({ key, item }) => {
      clazzStore.set(key, item);
    });
    expectStore.set(clazzoption.clazz, clazzStore);
  });
  return ImportMock.mockOther(store, 'default', expectStore);
};

export const mockKeyStores = (keyStores: Map<Function, Map<string, StoreItemType>>) => {
  return ImportMock.mockOther(store, 'keyStores', keyStores);
};

export const mockOriginalKeyStores = (originalKeyStores: Map<Function, Map<string, StoreItemOptions[]>>) => {
  return ImportMock.mockOther(store, 'originalKeyStores', originalKeyStores);
};
