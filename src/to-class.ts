import { isArray } from 'lodash';
import { getOriginalKetStore } from './utils';
import { JosnType, StoreItemOptions, BasicClass, ToClassOptions } from './typing';

const objectToClass = <T>(
  originalKeyStore: Map<string, StoreItemOptions[]>,
  jsonObj: { [key: string]: any },
  Clazz: BasicClass<T>,
  options: ToClassOptions,
): T => {
  const instance: any = new Clazz();
  originalKeyStore.forEach((propertiesOptions: StoreItemOptions[], originalKey) => {
    const originalValue = jsonObj[originalKey];
    propertiesOptions.forEach((storeItemoptions: StoreItemOptions) => {
      const { key, beforeDeserializer, deserializer, targetClass, optional, array, dimension } = storeItemoptions;
      const disallowIgnoreDeserializer = storeItemoptions.disallowIgnoreDeserializer || !options.ignoreDeserializer;
      const disallowIgnoreBeforeDeserializer =
        storeItemoptions.disallowIgnoreBeforeDeserializer || !options.ignoreBeforeDeserializer;

      let value = originalValue;
      if (originalKey && value === undefined) {
        if (storeItemoptions.default !== undefined) {
          instance[key] = storeItemoptions.default;
          return;
        }
        if (!optional) {
          throw new Error(`Can't map '${originalKey}' to ${Clazz.name}.${key}, property '${originalKey}' not found`);
        }
        return;
      }
      value =
        beforeDeserializer && disallowIgnoreBeforeDeserializer
          ? beforeDeserializer(value, instance, jsonObj, options)
          : value;
      if (value && targetClass) {
        if (array) {
          if (dimension === 1) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            value = toClasses(value, targetClass, options);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            value = value.map((cur: any) => toClasses(cur, targetClass, options));
          }
          instance[key] = value;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          value = toClass(value, targetClass, options);
        }
      }
      instance[key] =
        deserializer && disallowIgnoreDeserializer ? deserializer(value, instance, jsonObj, options) : value;
    });
  });
  return instance;
};

export const toClasses = <T>(rawJson: JosnType[], Clazz: BasicClass<T>, options: ToClassOptions = {}): T[] => {
  if (!isArray(rawJson)) {
    throw new Error(`rawJson ${rawJson} must be an array`);
  }
  const { constructor } = Clazz.prototype;
  const originalKetStore = getOriginalKetStore(constructor);
  return rawJson.map((item: object) => objectToClass<T>(originalKetStore, item, constructor, options));
};

export const toClass = <T>(rawJson: JosnType, Clazz: BasicClass<T>, options: ToClassOptions = {}): T => {
  const { constructor } = Clazz.prototype;
  return objectToClass<T>(getOriginalKetStore(constructor), rawJson as object, constructor, options);
};
