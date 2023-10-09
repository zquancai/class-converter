import isArray from 'isarray';
import { getKeyStore, isUndefined, isNullOrUndefined } from './utils';
import { JsonType, BasicClass, StoreItemType, ToPlainOptions } from './typing';

export const arrayItemToObject = <T>(arrayVal: any[], Clazz: BasicClass<T>, options: ToPlainOptions): any => {
  return arrayVal.map((v: any) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    isArray(v) ? arrayItemToObject(v, Clazz, options) : classToObject(v, Clazz, options),
  );
};

const classToObject = <T>(instance: JsonType, Clazz: BasicClass<T>, options: ToPlainOptions): JsonType => {
  const obj: JsonType = {};
  const keyStore = getKeyStore(Clazz);
  keyStore.forEach((propertiesOption: StoreItemType, key: keyof JsonType) => {
    const isValueNotExist = options.distinguishNullAndUndefined ? isUndefined : isNullOrUndefined;
    const instanceValue = isValueNotExist(instance[key]) ? propertiesOption.default : instance[key];
    const { originalKey, afterSerializer, serializer, targetClass, optional } = propertiesOption;
    const disallowIgnoreSerializer = propertiesOption.disallowIgnoreSerializer || !options.ignoreSerializer;
    const disallowIgnoreAfterSerializer =
      propertiesOption.disallowIgnoreAfterSerializer || !options.ignoreAfterSerializer;

    if (isValueNotExist(instanceValue)) {
      if (!optional) {
        throw new Error(`Property '${Clazz.name}.${key}' not found`);
      }
      return;
    }
    let value =
      serializer && disallowIgnoreSerializer ? serializer(instanceValue, instance, obj, options) : instanceValue;
    if (value && targetClass) {
      if (isArray(value)) {
        value = arrayItemToObject(value, targetClass, options);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        value = toPlain(value, targetClass, options);
      }
    }
    obj[originalKey] =
      afterSerializer && disallowIgnoreAfterSerializer ? afterSerializer(value, instance, obj, options) : value;
  });
  return obj;
};

export const toPlains = <T>(instances: (T | JsonType)[], Clazz: BasicClass<T>, options: ToPlainOptions = {}): any[] => {
  if (!isArray(instances)) {
    throw new Error(`${Clazz} instances must be an array`);
  }
  return instances.map((item: JsonType) => classToObject<T>(item, Clazz, options));
};

export const toPlain = <T>(instance: T | JsonType, Clazz: BasicClass<T>, options: ToPlainOptions = {}): any => {
  return classToObject<T>(instance, Clazz, options);
};
