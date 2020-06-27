import isArray from 'isarray';
import { getKeyStore, isUndefined, isNullOrUndefined } from './utils';
import { JosnType, BasicClass, StoreItemType, ToPlainOptions } from './typing';

const classToObject = <T>(
  keyStore: Map<string, StoreItemType>,
  instance: JosnType,
  Clazz: BasicClass<T>,
  options: ToPlainOptions,
): JosnType => {
  const obj: JosnType = {};
  keyStore.forEach((propertiesOption: StoreItemType, key: keyof JosnType) => {
    const isValueNotExist = options.distinguishNullAndUndefined ? isUndefined : isNullOrUndefined;
    const instanceValue = isValueNotExist(instance[key]) ? propertiesOption.default : instance[key];
    const { originalKey, afterSerializer, serializer, targetClass, optional, array, dimension } = propertiesOption;
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
      if (array) {
        if (dimension === 1) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          value = toPlains(value, targetClass, options);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          value = value.map((cur: any) => toPlains(cur, targetClass, options));
        }
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

export const toPlains = <T>(instances: (T | JosnType)[], Clazz: BasicClass<T>, options: ToPlainOptions = {}): any[] => {
  if (!isArray(instances)) {
    throw new Error(`${Clazz} instances must be an array`);
  }
  const keyStore = getKeyStore(Clazz);
  return instances.map((item: JosnType) => classToObject<T>(keyStore, item, Clazz, options));
};

export const toPlain = <T>(instance: T | JosnType, Clazz: BasicClass<T>, options: ToPlainOptions = {}): any => {
  return classToObject<T>(getKeyStore(Clazz), instance, Clazz, options);
};
