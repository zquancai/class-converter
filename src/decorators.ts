import { setStore } from './store';

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
