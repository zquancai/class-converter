import { setStore } from './store';
import { StoreItemType, StoreItemOptions } from './typing';

export function serialize(serializer: StoreItemType['serializer'], disallowIgnore = false) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      serializer,
      disallowIgnoreSerializer: disallowIgnore,
    });
  };
}

export function deserialize(deserializer: StoreItemType['deserializer'], disallowIgnore = false) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      deserializer,
      disallowIgnoreDeserializer: disallowIgnore,
    });
  };
}

export function beforeDeserialize(beforeDeserializer: StoreItemType['beforeDeserializer'], disallowIgnore = false) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      beforeDeserializer,
      disallowIgnoreBeforeDeserializer: disallowIgnore,
    });
  };
}

export function afterSerialize(afterSerializer: StoreItemType['afterSerializer'], disallowIgnore = false) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      afterSerializer,
      disallowIgnoreAfterSerializer: disallowIgnore,
    });
  };
}

export function serializeTarget() {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      serializeTarget: true,
    });
  };
}

export function property(originalKey?: string, targetClass?: StoreItemType['targetClass'], isOptional = false) {
  return (target: any, propertyKey: string) => {
    const config: StoreItemOptions = {
      originalKey: originalKey || propertyKey,
      key: propertyKey,
    };
    if (targetClass) {
      config.targetClass = targetClass.prototype.constructor;
    }
    if (isOptional) {
      config.optional = isOptional;
    }
    setStore(target, config);
  };
}

export function typed(targetClass: StoreItemType['targetClass']) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      targetClass,
    });
  };
}

export function optional() {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      optional: true,
    });
  };
}

export function defaultVal(value: any) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      default: value,
    });
  };
}
