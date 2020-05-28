import { toPlain } from '../src';

export class BaseModel<T extends BaseModel<T>, R = Record<string, any>> {
  constructor(args: { [key in keyof Omit<T, keyof BaseModel<T>>]: T[key] }) {
    Object.assign(this, args);
  }

  // convert to plain json
  toJSON(): T {
    const object: any = {};
    Object.entries(this).forEach(([key, value]) => {
      if (value.toJSON) {
        object[key] = value.toJSON();
      } else {
        object[key] = value;
      }
    });
    return object;
  }

  // use serialize in class-converter module to convert class to raw json
  toPlain(): R {
    return toPlain(this, this.constructor as any);
  }
}
