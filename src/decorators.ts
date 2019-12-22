import { setStore } from './store';
import { DimensionRange } from './typing';

export function serialize(serializer: (value: any, instance: any, origin: any) => any) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      serializer,
    });
  };
}

export function deserialize(deserializer: (value: any, instance: any, origin: any) => any) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      deserializer,
    });
  };
}

export function property(originalKey: string, targetClass?: { new (...args: any[]): any }, optional = false) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      originalKey,
      key: propertyKey,
      targetClass,
      optional,
    });
  };
}

export function array(dimension: DimensionRange = 1) {
  return (target: any, propertyKey: string) => {
    setStore(target, {
      key: propertyKey,
      array: true,
      dimension,
    });
  };
}
