import isArray from 'isarray';
import { getOriginalKeyStore, isUndefined, isNullOrUndefined } from './utils';
import { JosnType, StoreItemOptions, BasicClass, ToClassOptions } from './typing';

export const arrayItemToClass = <T>(arrayVal: any[], Clazz: BasicClass<T>, options: ToClassOptions): any => {
  return arrayVal.map((v: any) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    isArray(v) ? arrayItemToClass(v, Clazz, options) : objectToClass(v, Clazz, options),
  );
};

const objectToClass = <T>(jsonObj: Record<string, any>, Clazz: BasicClass<T>, options: ToClassOptions): T => {
  const instance: any = new Clazz();
  const originalKeyStore = getOriginalKeyStore(Clazz);
  originalKeyStore.forEach((propertiesOptions: StoreItemOptions[], originalKey) => {
    const originalValue = jsonObj[originalKey];
    propertiesOptions.forEach((storeItemoptions: StoreItemOptions) => {
      const { key, beforeDeserializer, deserializer, targetClass, optional } = storeItemoptions;
      const disallowIgnoreDeserializer = storeItemoptions.disallowIgnoreDeserializer || !options.ignoreDeserializer;
      const disallowIgnoreBeforeDeserializer =
        storeItemoptions.disallowIgnoreBeforeDeserializer || !options.ignoreBeforeDeserializer;

      const isValueNotExist = options.distinguishNullAndUndefined ? isUndefined : isNullOrUndefined;
      let value = originalValue;
      if (isValueNotExist(value)) {
        if (!isValueNotExist(storeItemoptions.default)) {
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
        if (isArray(value)) {
          value = arrayItemToClass(value, targetClass, options);
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
  return rawJson.map((item: object) => objectToClass<T>(item, constructor, options));
};

export const toClass = <T>(rawJson: JosnType, Clazz: BasicClass<T>, options: ToClassOptions = {}): T => {
  const { constructor } = Clazz.prototype;
  return objectToClass<T>(rawJson as object, constructor, options);
};
